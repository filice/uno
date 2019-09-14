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
      id: utils.genRoomId(),
    });

    return game.id;
  }

  createPlayer(name, gameId) {
    // Validate input
    if (!name || name.length < 4 || name.length > 15) {
      return [true, 'Name must be 4 - 15 characters long.'];
    }

    if (!gameId || String(gameId).length !== 5) {
      return [true, 'Game ID invalid.'];
    }

    // Check if game exists
    if (!this.games.find({ id: gameId })) {
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
}

module.exports = Database;
