import thunk from 'redux-thunk';
import { applyMiddleware, compose, createStore } from 'redux';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

import createRootReducer from './reducers';
import { disconnectSocket } from './middleware';

export const history = createBrowserHistory();

// Redux Devtools
const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      trace: true,
    }) : compose;

const store = createStore(
  createRootReducer(history),

  composeEnhancers(
    applyMiddleware(
      routerMiddleware(history),
      thunk,

      disconnectSocket,
    ),
  ),
);

export default store;
