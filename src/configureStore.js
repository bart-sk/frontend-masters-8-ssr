import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import commonReducers from './reducer';
import API from './API';

let composeEnhancers;
if (typeof window !== 'undefined') {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
} else {
  composeEnhancers = compose;
}

export default function configureStore(preloadedState = {}) {
  return createStore(
    combineReducers(
      Object.assign({}, commonReducers, {
        routing: routerReducer,
      }),
    ),
    preloadedState,
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(browserHistory),
        thunkMiddleware.withExtraArgument(API),
      ),
    ),
  );
}
