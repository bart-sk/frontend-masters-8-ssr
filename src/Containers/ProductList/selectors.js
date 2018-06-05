import { createSelector } from 'reselect';
import { productEntitiesSelector } from '../../Containers/App/selectors';

const productsDomain = state => state.products;

export const productsIsFetchingSelector = createSelector(
  productsDomain,
  substate => substate.isFetching,
);

const productsIdsSelector = createSelector(
  productsDomain,
  substate => substate.result,
);

export const productsSelector = createSelector(
  productsIdsSelector,
  productEntitiesSelector,
  (ids, productEntities) => ids.map(id => productEntities[id]),
);
