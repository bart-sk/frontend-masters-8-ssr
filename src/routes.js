import React from 'react';
import { Router, Route } from 'react-router';

// containers
import App from './Containers/App';
import ProductList from './Containers/ProductList';
import Product from './Containers/Product';
import NotFound from './Components/NotFound';

const Routes = props => {
  return (
    <Router {...props}>
      <Route component={App}>
        <Route path="/" component={ProductList} />
        <Route path="/product/:productId" component={Product} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  );
};

export default Routes;
