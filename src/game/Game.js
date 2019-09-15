const jwt = require('jsonwebtoken');
const socketioJwt = require('socketio-jwt');

const deck = require('./deck.js');

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
    });
  }

  updatePlayers(io, game) {
    const players = this.getPlayersInGame(io, game);

    if (players.length === 0) {
      return false;
    } else {
      io.in(game).emit('players', players);
      return true;
    }
  }

  getPlayersInGame(io, game) {
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
  }

  updateGameState(io, game) {
    io.in(game).emit('game state', this.db.getGameState(game));
  }
}

module.exports = Game;
