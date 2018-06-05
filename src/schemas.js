import { schema } from 'normalizr';

export const productSchema = new schema.Entity(
  'products',
  {},
  {
    idAttribute: '_id',
  },
);
