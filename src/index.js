import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { injectGlobal, ThemeProvider } from 'styled-components';
import { Router, Route, browserHistory } from 'react-router';
import theme from './theme';
import API from './API';
import NotFound from './Components/NotFound';
import App from './Containers/App';
import Product from './Containers/Product';
import ProductList from './Containers/ProductList';

import configureStore from './configureStore';

// eslint-disable-next-line
injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,500&subset=latin-ext');
  html, body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    background: #fff;
  }
  #root {
    height: 100%;
  }
  * {
    box-sizing: border-box;
  }
`;

API.setBaseUrl(process.env.REACT_APP_API_BASE_URL);

// Initialise redux store
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router history={browserHistory}>
        <Route component={App}>
          <Route path="/" component={ProductList} />
          <Route path="/product/:productId" component={Product} />
          <Route path="*" component={NotFound} />
        </Route>
      </Router>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
