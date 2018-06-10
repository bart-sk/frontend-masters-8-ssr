import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { browserHistory } from 'react-router';
import Router from './routes';
import theme from './theme';
import API from './API';
import './globalStyles';
import configureStore from './configureStore';

API.setBaseUrl(process.env.REACT_APP_API_BASE_URL);

// Get initial redux state from server
let defaultState = {};
const initialState = window.__REDUX_STATE__ || '{{SSR_INITIAL_STATE}}';
if (initialState !== '{{SSR_INITIAL_STATE}}') {
  defaultState = initialState;
}

// Initialise redux store
const store = configureStore(defaultState);

ReactDOM.hydrate(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router history={browserHistory} />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
