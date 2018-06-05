import { entitiesReducer } from './Containers/App/reducer';
import { productDetailReducer } from './Containers/Product/reducer';
import { productsReducer } from './Containers/ProductList/reducer';

export default {
  entities: entitiesReducer,
  products: productsReducer,
  productDetail: productDetailReducer,
};
