import store from './store';
import { gameConnected, updatePlayers } from './actions';

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
        });

    }).on('disconnect', () => {
      store.dispatch(gameConnected(false));
    });

};

export { connectSocket };
