import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_SUCCESS,
} from './constants';

const productsReducer = (
  state = {
    isFetching: false,
    result: [],
  },
  action,
) => {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        isFetching: false,
      };
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        result: action.payload.products,
        isFetching: false,
      };
    default:
      return state;
  }
};

export { productsReducer };
