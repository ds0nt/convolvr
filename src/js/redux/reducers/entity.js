import {
    ENTITY_ADD,
    ENTITIES_FETCH,
    ENTITIES_FETCH_FAILED,
    ENTITIES_FETCH_DONE,
    UPDATE_ENTITY,
    DELETE_ENTITY
} from '../constants/action-types';

module.exports = function entities (state = {
    instances: [],
    types: [],
    current: null
}, action) {
  switch (action.type) {
    case ENTITY_ADD:
        return Object.assign({}, state, {
            instances: [
                ...state.instances,
                {
                    id: action.id,
                    name: action.name,
                    components: action.components
                }
            ]
        })
    case DELETE_ENTITY:

    case ENTITIES_FETCH:

    case ENTITIES_FETCH_DONE:
        return Object.assign({}, state, {
            types: action.data.types,
            instances: action.data.instances
        })
    case ENTITIES_FETCH_FAILED:

    case UPDATE_ENTITY:
        return state.map((entity, index) => {
          if (entity.id == action.id) {
            return Object.assign({}, entity, {
              id: action.id,
              name: action.name,
              components: action.components
            })
          }
          return entity;
        })
    default:
      return state;
  }
};
