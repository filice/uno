import axios from 'axios';
import { push } from 'connected-react-router';

import {
  FAIL,
  PENDING,
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
