import { normalize } from 'normalizr';
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_SUCCESS,
} from './constants';
import { productSchema } from '../../schemas';

const requestProducts = () => ({
  type: FETCH_PRODUCTS_REQUEST,
  payload: {},
});

const requestProductsFailure = error => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: {
    error,
  },
});

const requestProductsSuccess = (entities, products) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: {
    entities,
    products,
  },
});

export const loadProducts = () => {
  return async (dispatch, getState, API) => {
    dispatch(requestProducts());
    try {
      // call API
      const response = await API.listProducts();

      // normalize!
      const normalized = normalize(response.products, [productSchema]);

      // dispatch!
      dispatch(requestProductsSuccess(normalized.entities, normalized.result));
    } catch (e) {
      dispatch(requestProductsFailure(e.message));
    }
  };
};
