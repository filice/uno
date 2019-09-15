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
    game.curTurn = game.players[0];
    this.games.update(game);
  }
}

module.exports = Database;
