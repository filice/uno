const jwt = require('jsonwebtoken');

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
}

module.exports = Game;
