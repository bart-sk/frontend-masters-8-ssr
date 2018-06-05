import { normalize } from 'normalizr';
import {
  FETCH_PRODUCT_DETAIL_REQUEST,
  FETCH_PRODUCT_DETAIL_FAILURE,
  FETCH_PRODUCT_DETAIL_SUCCESS,
} from './constants';
import { productSchema } from '../../schemas';

const requestProductDetail = id => ({
  type: FETCH_PRODUCT_DETAIL_REQUEST,
  payload: {
    id,
  },
});

const requestProductDetailFailure = id => ({
  type: FETCH_PRODUCT_DETAIL_FAILURE,
  payload: {
    id,
  },
});

const requestProductDetailSuccess = (entities, id) => ({
  type: FETCH_PRODUCT_DETAIL_SUCCESS,
  payload: {
    entities,
    id,
  },
});

export const loadProductDetail = id => {
  return async (dispatch, getState, API) => {
    dispatch(requestProductDetail(id));
    try {
      // call API
      const response = await API.productDetail(id);

      // normalize!
      const normalized = normalize(response, productSchema);

      // dispatch!
      dispatch(
        requestProductDetailSuccess(normalized.entities, normalized.result),
      );
    } catch (e) {
      dispatch(requestProductDetailFailure(id));
    }
  };
};
