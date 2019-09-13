import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { createGame } from './game';
import { createPlayer, player } from './player';

const createRootReducer = history => combineReducers({
  router: connectRouter(history),

  createGame,
  createPlayer,
  player,
});

export default createRootReducer;
