import { createSelector } from 'reselect';

const entitiesDomain = state => state.entities;

export const productEntitiesSelector = createSelector(
  entitiesDomain,
  entities => entities.products || {},
);
