const express = require('express');
const jwt = require('express-jwt');
const bodyParser = require('body-parser');

const Database = require('./Database.js');
const Game = require('./Game.js');

class App {
  constructor() {
    // Configure webserver
    const app = express();
    this.app = app;

    app.use(bodyParser.json());

    // Configure database
    this.db = new Database();

    // Setup game
    this.game = new Game(this.db);

    // Routes
    this.game.route(app);
  }

  start(port) {
    this.app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
}

const port = process.env.PORT || 8080;
// Start server
(new App()).start(port);
