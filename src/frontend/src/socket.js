import store from './store';
import {
  gameConnected,
  gameStarting,
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

export {
  connectSocket,
  sendStartGame,
};
