import io from 'socket.io-client';

import {
  FAIL,
  GAME_CONNECTED,
  GAME_DISCONNECTED,
  GAME_STARTED,
  GAME_STARTING,
  GAME_STATE_UPDATED,
  PENDING,
  PLAYERS_UPDATED,
  SUCCESS,
} from '../actionTypes';
import { connectSocket } from '../socket';

const initCreateGameState = {
  loading: false,
  success: false,
  error: null,
};

export const createGame = (state = initCreateGameState, action) => {
  switch (action.type) {
    case PENDING('CREATE_GAME'):
      return {
        ...initCreateGameState,
        loading: true,
      };

    case SUCCESS('CREATE_GAME'):
      return {
        ...initCreateGameState,
        success: true,
      };

    case FAIL('CREATE_PLAYER'):
      return {
        ...initCreateGameState,
        error: action.payload,
      };

    default:
      return state;
  }
};

const initGameState = {
  socket: null,
  connected: false,
  players: [],
  starting: false,
  started: false,
  state: {},
};

export const game = (state = initGameState, action) => {
  switch (action.type) {
    case SUCCESS('CREATE_PLAYER'):
      // Create socket
      const socket = io();
      connectSocket(socket);

      return {
        ...initGameState,
        socket,
      };
      break;

    case GAME_CONNECTED:
      return {
        ...state,
        connected: true,
      };

    case GAME_DISCONNECTED:
      return {
        ...initGameState,
      };

    case PLAYERS_UPDATED:
      return {
        ...state,
        players: action.payload,
      };
      break;

    case GAME_STARTING:
      return {
        ...state,
        starting: true,
      };

    case GAME_STARTED:
      return {
        ...state,
        started: true,
      };

    case GAME_STATE_UPDATED:
      return {
        ...state,
        state: action.payload,
      };

    default:
      return state;
  }
};
