import axios from 'axios';
import { replace } from 'connected-react-router';

import {
  FAIL,
  GAME_CONNECTED,
  GAME_DISCONNECTED,
  GAME_STARTING,
  PENDING,
  PLAYERS_UPDATED,
  SUCCESS,
} from '../actionTypes';
import { createPlayer } from '../actions';

export const createGame = name => dispatch => {
  dispatch({ type: PENDING('CREATE_GAME') });

  axios({
    url: '/api/game',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => {
    dispatch({ type: SUCCESS('CREATE_GAME') });

    dispatch(createPlayer(name, res.data.id));
  }).catch(err => {
    dispatch({
      type: FAIL('CREATE_GAME'),
      payload: err.response.data,
    });
  });
};

export const gameConnected = connected => dispatch => {
  if (connected) {
    dispatch({ type: GAME_CONNECTED });
  } else {
    dispatch({ type: GAME_DISCONNECTED });
    dispatch(replace('/lobby'));
  }
}

export const updatePlayers = players => dispatch => {
  dispatch({
    type: PLAYERS_UPDATED,
    payload: players,
  });
};

export const gameStarting = () => dispatch => {
  dispatch({ type: GAME_STARTING, });
}
