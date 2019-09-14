const GAME_ROUTES = [
  '/lobby',
];

// Disconnect socket when changing to non-game route
export const disconnectSocket = store => next => action => {
  if ( // Route changed
      action.type == '@@router/LOCATION_CHANGE' &&
       // New route is *not* a game route
      !GAME_ROUTES.includes(action.payload.location.pathname) &&
       // Game socket exists
      store.getState().game.socket) {

    // Forcefully disconnect socket
    store.getState().game.socket.close();
  }

  return next(action);
};
