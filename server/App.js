const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const Database = require('./Database.js');
const Game = require('./game/Game.js');

const ENV = process.env.NODE_ENV || 'development';

class App {
  constructor() {
    // Configure web server
    this.app = express();
    this.app.use(bodyParser.json());
    if (ENV === 'production') {
      this.app.use(express.static(path.join(__dirname, '../frontend/dist')));
      this.app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
      });
    }

    // Configure Socket.io server
    this.server = http.Server(this.app);
    this.io = socketio(this.server);

    // Configure database
    this.db = new Database();

    // Setup game
    this.game = new Game(this.db);
    // Web routes
    this.game.route(this.app);
    // Socket.io
    this.game.connect(this.io);
  }

  start(port) {
    this.server.listen(port, () => {
      console.log(`Server listening on port ${port}`);

      this.startPrompt();
    });
  }

  startPrompt() {
    process.stdin.setEncoding('utf-8');
    process.stdout.write('> ');

    process.stdin.on('data', data => {
      try {
        console.log(eval(data.trim()));
      } catch (e) {
        console.error(e);
      }

      process.stdout.write('> ');
    });
  }
}

module.exports = App;
