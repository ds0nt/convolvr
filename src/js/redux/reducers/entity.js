import {
    ADD_ENTITY,
    FETCH_ENTITIES,
    FAILED_FETCH_ENTITIES,
    RECEIVE_ENTITIES,
    UPDATE_ENTITY,
    DELETE_ENTITY
} from '../constants/action-types';

module.exports = function entities (state = {
    instances: [],
    types: [],
    current: null
}, action) {
  switch (action.type) {
    case ADD_ENTITY:
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

    case FETCH_ENTITIES:

    case RECEIVE_ENTITIES:
        return Object.assign({}, state, {
            types: action.data.types,
            instances: action.data.instances
        })
    case FAILED_FETCH_ENTITIES:

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
