import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { createGame, game } from './game';
import { createPlayer, player } from './player';

const createRootReducer = history => combineReducers({
  router: connectRouter(history),

  createGame,
  game,
  createPlayer,
  player,
});

export default createRootReducer;
