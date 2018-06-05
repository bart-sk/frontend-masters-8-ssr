import { createSelector } from 'reselect';
import { productEntitiesSelector } from '../../Containers/App/selectors';

const productDetailDomain = state => state.productDetail;

const currentProductDomain = id =>
  createSelector(productDetailDomain, substate => substate[id] || {});

export const currentProductIsFetchingSelector = id =>
  createSelector(
    currentProductDomain(id),
    substate => substate.isFetching || false,
  );

export const currentProductDetailSelector = id =>
  createSelector(
    productEntitiesSelector,
    productEntities => productEntities[id] || null,
  );
