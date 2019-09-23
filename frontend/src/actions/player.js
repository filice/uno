import axios from 'axios';
import { push } from 'connected-react-router';

import {
  FAIL,
  PENDING,
  PLAYER_STATE_UPDATED,
  SUCCESS,
} from '../actionTypes';

export const createPlayer = (name, gameId) => dispatch => {
  dispatch({ type: PENDING('CREATE_PLAYER') });

  axios({
    url: '/api/player',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      name,
      gameId,
    }),
  }).then(res => {
    dispatch({
      type: SUCCESS('CREATE_PLAYER'),
      payload: { ...res.data },
    });

    dispatch(push('/lobby'));
  }).catch(err => {
    dispatch({
      type: FAIL('CREATE_PLAYER'),
      payload: err.response.data,
    });
  });
};

export const playerStateUpdated = payload => dispatch => {
  dispatch({
    type: PLAYER_STATE_UPDATED,
    payload,
  });
}
