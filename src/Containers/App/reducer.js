import merge from 'lodash/merge';

const entitiesReducer = (state = {}, action) => {
  if (action.payload && action.payload.entities) {
    return merge({}, state, action.payload.entities);
  }
  return state;
};

export { entitiesReducer };
