const jwt = require('jsonwebtoken');
const socketioJwt = require('socketio-jwt');

const deck = require('./deck.js');
const shared = require('../../shared');

const TOKEN_SECRET = process.env.TOKEN_KEY || 'secret';

class Game {
  constructor(db) {
    this.db = db;
  } 

  createGame(req, res) {
    const id = this.db.createGame();
    return res.status(201).json({ id });
  }

  createPlayer(req, res) {
    const [error, data] = this.db.createPlayer(req.body.name,
                                               req.body.gameId);
    if (error) {
      return res.status(400).send(data);
    }

    const resData = {
      uuid: data.uuid,
      name: data.name, 
      game: data.game,
    };

    res.status(201).json({
      ...resData,
      token: jwt.sign({ ...resData },
        TOKEN_SECRET,
        { expiresIn: '24h' }),
    });
  }

  route(app) {
    // Map routes to Express app
    [
      {
        method: 'post',
        route: '/game',
        callback: this.createGame,
      },
      {
        method: 'post',
        route: '/player',
        callback: this.createPlayer,
      },
    ].map(r => {
      app[r.method]('/api' + r.route, r.callback.bind(this));
    });
  }

  connect(io) {
    io
      .on('connection', socketioJwt.authorize({
        secret: TOKEN_SECRET,
        timeout: 10000,
      })).on('authenticated', socket => {
        const player = socket.decoded_token;

        // Verify that player exists
        if (!this.db.verifyPlayer(player.uuid)) {
          socket.disconnect(true);
        }

        socket.on('disconnect', () => {
          this.db.removePlayer(player.uuid);

          const hasPlayers = this.updatePlayers(io, player.game);
          if (!hasPlayers) {
            this.db.deleteGame(player.game);
          }
        });

        // Add player to room
        socket.join(player.game);
        this.updatePlayers(io, player.game);

        socket.on('start game', () => {
          io.in(player.game).emit('starting game');
          this.startGame(io, player.game);
          this.updateGameState(io, player.game);
        });

        socket.on('play card', card => {
          const game = this.db.getGameState(player.game);

          // It's the player's turn
          if (player.uuid !== game.curTurn) return;
          // The player has the card in their hand
          if (!this.db.playerHasCard(player.uuid, card)) return;
          // The card can be played on the current discard pile top card
          if (!shared.canPlay(card, game.discardTop)) return;

          this.db.playCard(player.game, player.uuid, card);

          this.nextTurn(io, player.game);
        });

        socket.on('draw card', () => {
          const game = this.db.getGameState(player.game);

          // It's the player's turn
          if (player.uuid !== game.curTurn) return;

          this.db.drawCards(player.game, player.uuid);

          this.nextTurn(io, player.game);
        });
    });
  }

  updatePlayers(io, game) {
    const players = this.getSocketPlayersInGame(io, game);

    if (players.length === 0) {
      return false;
    } else {
      io.in(game).emit('players', players);
      return true;
    }
  }

  getSocketPlayersInGame(io, game) {
    if (!(game in io.sockets.adapter.rooms)) {
      return [];
    }

    const sockets = io.sockets.adapter.rooms[game].sockets;

    let players = [];
    for (const socketId in sockets) {
      const socket = io.sockets.connected[socketId];
      players.push({
        name: socket.decoded_token.name,
        uuid: socket.decoded_token.uuid,
      });
    }

    return players;
  }

  startGame(io, game) {
    // Setup deck
    this.db.loadDeck(game, deck.getShuffledDeck());
    // Add players and deal hands
    this.db.addPlayers(game);

    io.in(game).emit('game started');

    this.updatePlayerStates(io, game);
  }

  updateGameState(io, game) {
    io.in(game).emit('game state', this.db.getGameState(game));
  }

  updatePlayerStates(io, game) {
    const players = this.db.getPlayersInGame(game);
    const sockets = io.sockets.adapter.rooms[game].sockets;

    for (const player of players) {
      for (const socketId in sockets) {
        const socket = io.sockets.connected[socketId];
        if (socket.decoded_token.uuid === player.uuid) {
          const [p, playerState] = this.db.getPlayer(player.uuid);
          socket.emit('player state', playerState);
        }
      }
    }
  }

  nextTurn(io, game) {
    this.db.nextTurn(game);
    this.updateGameState(io, game);
    this.updatePlayerStates(io, game);
  }
}

module.exports = Game;
