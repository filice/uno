import {
  FAIL,
  PENDING,
  SUCCESS,
} from '../constants';

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
