import { push } from 'connected-react-router';

import store from './store';
import {
  gameConnected,
  gameStarted,
  gameStarting,
  gameStateUpdated,
  gameWinner,
  playerStateUpdated,
  updatePlayers,
} from './actions';

const getSocket = () => store.getState().game.socket;

const connectSocket = socket => {
  socket
    .on('connect', () => {
      const token = store.getState().player.token;

      // Authenticate
      socket
        .emit('authenticate', { token })
        .on('authenticated', () => {
          store.dispatch(gameConnected(true));

          // Update player list
          socket.on('players', players => {
            store.dispatch(updatePlayers(players));
          });

          // Game starting
          socket.on('starting game', () => store.dispatch(gameStarting()));

          // Game started
          socket.on('game started', () => {
            store.dispatch(gameStarted());
            store.dispatch(push('/game'));
          });

          // Game state updated
          socket.on('game state', state => {
            store.dispatch(gameStateUpdated(state));
          });

          socket.on('player state', state => {
            store.dispatch(playerStateUpdated(state));
          });

          socket.on('winner', state => {
            store.dispatch(gameWinner(state));
          });
        });

    }).on('disconnect', () => {
      store.dispatch(gameConnected(false));
    });
};

const sendStartGame = () => {
  const socket = getSocket();
  if (!socket) return;

  socket.emit('start game');
}

const playCard = card => {
  const socket = getSocket();
  if (!socket) return;

  socket.emit('play card', card);
};

const drawCard = () => {
  const socket = getSocket();
  if (!socket) return;

  socket.emit('draw card');
};

export {
  connectSocket,
  drawCard,
  playCard,
  sendStartGame,
};
