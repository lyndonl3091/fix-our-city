import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import persistState from 'redux-localstorage';
import rootReducer from '../reducers';
import promiseMiddleware from '../middlewares/promiseMiddleware';

/*
 * @param {Object} initial state to bootstrap our stores with for server-side rendering
 * @param {History Object} a history object. We use `createMemoryHistory` for server-side rendering,
 *                          while using browserHistory for client-side
 *                          rendering.
 */
export default function configureStore(initialState, history) {
  // Installs hooks that always keep react-router and redux store in sync
  const middleware = [thunk, promiseMiddleware, routerMiddleware(history)];
  let store;

  if (__DEVCLIENT__) {
    middleware.push(createLogger());
    store = createStore(rootReducer, initialState, compose(
      applyMiddleware(...middleware),
      persistState(['issues']),
      typeof window === 'object' &&
        typeof window.devToolsExtension !== 'undefined' ?
        window.devToolsExtension() : f => f
    ));
  } else {
    store = createStore(rootReducer, initialState, compose(applyMiddleware(...middleware), persistState(), f => f));
  }

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('reducers', () => {
      const nextReducer = require('../reducers');

      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
