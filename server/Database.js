const jwt = require('jsonwebtoken');
const loki = require('lokijs');
const uuid = require('uuid/v4');

const utils = require('./utils.js');

class Database {
  constructor() {
    const db = new loki('Uno');
    this.games = db.addCollection('games');
    this.players = db.addCollection('players');
  }

  createGame() {
    const game = this.games.insert({
      id: utils.genUniqueId(this.games),
    });

    return game.id;
  }

  deleteGame(id) {
    this.games.findAndRemove({ id });
    this.players.findAndRemove({ game: id });
  }

  createPlayer(name, gameId) {
    // Validate input
    if (!name || name.length < 4 || name.length > 15) {
      return [true, 'Name must be 4 - 15 characters long.'];
    }

    if (!gameId || gameId.length !== 5) {
      return [true, 'Game ID invalid.'];
    }

    // Check if game exists
    if (!this.games.count({ id: gameId}) > 0) {
      return [true, 'Game not found.'];
    }

    const player = this.players.insert({
      uuid: uuid(),
      name,
      game: gameId,
    });

    return [false, player];
  }

  removePlayer(uuid) {
    this.players.findAndRemove({ uuid });
  }

  verifyPlayer(uuid) {
    return this.players.find({ uuid });
  }

  loadDeck(id, fullDeck) {
    let deck = fullDeck;
    // Place top of deck in discard
    const discard = [deck.shift()];

    this.games.updateWhere(g => g.id === id, game => {
      game.deck = deck;
      game.discard = discard;
    });
  }

  addPlayers(id) {
    let game = this.games.findOne({ id });
    game.players = [];

    for (let player of this.players.find({ game: id })) {
      player.hand = game.deck.splice(0, 7);
      game.players.push(player.uuid);
      this.players.update(player);
    }

    game.players = utils.shuffleArray(game.players);
    game.turnDirRight = true;
    game.curTurn = game.players[0];
    game.curColour = game.discard[0].colour;
    this.games.update(game);
  }

  getGameState(id) {
    const game = this.games.findOne({ id });
    const playerHands = {};

    for (const uuid of game.players) {
      const player = this.players.findOne({ uuid });
      playerHands[uuid] = ('hand' in player) ? player.hand.length : 0;
    }

    return {
      curTurn: game.curTurn,
      curColour: game.curColour,
      discardTop: game.discard[0],
      playerHands,
    }
  }

  getPlayersInGame(gameId) {
    return this.players.find({ game: gameId });
  }

  getPlayer(uuid) {
    const player = this.players.findOne({ uuid });
    return [
      player,
      {
        hand: player.hand,
      },
    ];
  }

  playerHasCard(uuid, cardIn) {
    const card = Object.assign({}, cardIn);

    if (card.type === 'wild' || card.type === '+4') {
      card.colour = null;
    }

    const player = this.players.findOne({ uuid });
    const foundCard = player.hand.find(c => (
      c.type === card.type && c.colour === card.colour
    ));
    return !!foundCard;
  }

  playCard(gameId, uuid, cardIn) {
    const game = this.games.findOne({ id: gameId });
    const player = this.players.findOne({ uuid });

    // Handle wild cards
    let card = Object.assign({}, cardIn);
    if (['wild', '+4'].includes(card.type)) card.colour = null;

    // Remove from hand
    player.hand.splice(player.hand.findIndex(c => (
      c.type === card.type && c.colour === card.colour
    )), 1);
    // Revert card
    card = Object.assign({}, cardIn);
    // Add to discard
    game.discard.unshift(card);

    this.games.update(game);
    this.players.update(player);

    // Handle action cards
    switch (card.type) {
      case 'skip':
        this.nextTurn(gameId);
        break;
      case 'reverse':
        game.turnDirRight = !game.turnDirRight;
        // Skip turn if two players
        if (game.players.length === 2) {
          this.nextTurn(gameId);
        }
        break;
      case '+2': {
        this.nextTurn(gameId);
        const nextPlayer = this.players.findOne({
          uuid: this.games.findOne({ id: gameId }).curTurn,
        });
        this.drawCards(gameId, nextPlayer.uuid, 2);
        break;
      }
      case 'wild':
        // Already handled
        break;
      case '+4': {
        this.nextTurn(gameId);
        const nextPlayer = this.players.findOne({
          uuid: this.games.findOne({ id: gameId }).curTurn,
        });
        this.drawCards(gameId, nextPlayer.uuid, 4);
        break;
      }
    }
  }

  drawCards(gameId, uuid, numCards = 1) {
    const game = this.games.findOne({ id: gameId });
    const player = this.players.findOne({ uuid });

    player.hand.push(...game.deck.splice(0, numCards));

    this.games.update(game);
    this.players.update(player);
  }

  nextTurn(gameId) {
    const game = this.games.findOne({ id: gameId });

    let curPlayerIndex = game.players.indexOf(game.curTurn);
    // Move left/right
    if (game.turnDirRight) {
      curPlayerIndex++;
    } else {
      curPlayerIndex--;
    }

    // Wrap
    if (curPlayerIndex > game.players.length - 1) {
      curPlayerIndex = 0;
    } else if (curPlayerIndex < 0) {
      curPlayerIndex = game.players.length - 1;
    }

    game.curTurn = game.players[curPlayerIndex];

    this.games.update(game);
  }

  getNumCards(uuid) {
    return this.players.findOne({ uuid }).hand.length;
  }
}

module.exports = Database;
