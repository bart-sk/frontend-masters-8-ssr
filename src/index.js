import React from "react";
import ReactDOM from "react-dom";
import { injectGlobal, ThemeProvider } from "styled-components";
import { Router, Route, browserHistory } from "react-router";
import theme from "./theme";
import API from "./API";
import App from "./Containers/App";
import Product from "./Containers/Product";
import ProductList from "./Containers/ProductList";

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

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Router history={browserHistory}>
      <Route component={App}>
        <Route path="/" component={ProductList} />
        <Route path="/product/:productId" component={Product} />
      </Route>
    </Router>
  </ThemeProvider>,
  document.getElementById("root")
);
