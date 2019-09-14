import {
  FAIL,
  PENDING,
  SUCCESS,
} from '../actionTypes';

const initCreatePlayerState = {
  loading: false,
  success: false,
  error: null,
};

export const createPlayer = (state = initCreatePlayerState, action) => {
 switch (action.type) {
   case PENDING('CREATE_PLAYER'):
     return {
       ...initCreatePlayerState,
       loading: true,
     };

   case SUCCESS('CREATE_PLAYER'):
     return {
       ...initCreatePlayerState,
       success: true,
     };
   
   case FAIL('CREATE_PLAYER'):
     return {
       ...initCreatePlayerState,
       error: action.payload,
     };
   
   default:
     return state;
 }
};

const initPlayerState = {
  loggedIn: false,
  uuid: '',
  name: '',
  game: '',
  token: '',
};

export const player = (state = initPlayerState, action) => {
  switch (action.type) {
    case SUCCESS('CREATE_PLAYER'):
      return {
        loggedIn: true,
        ...action.payload,
      };

    default:
      return state;
  }
};
