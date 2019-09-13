import axios from 'axios';

import {
  FAIL,
  PENDING,
  SUCCESS,
} from '../constants';
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
