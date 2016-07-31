import {
    ADD_COMPONENT,
    FETCH_COMPONENTS,
    RECIEVE_COMPONENTS,
    FAILED_FETCH_COMPONENTS,
    UPDATE_COMPONENT,
    DELETE_COMPONENT
} from '../constants/action-types';

module.exports = function components (state = {
    instances: [],
    types: [],
    current: null
}, action) {
  switch (action.type) {
    case ADD_COMPONENT:
      return [
        ...state,
        {
          name: action.name,
          data: action.data
        }
      ]
    case DELETE_COMPONENT:

    case FETCH_COMPONENTS:

    case RECIEVE_COMPONENTS:
        return Object.assign({}, state, {
                instances: action.data
        })
    case FAILED_FETCH_COMPONENTS:

    case UPDATE_COMPONENT:
    return state.map((component, index) => {
      if (index === action.id) {
        return Object.assign({}, component, {
          name: action.url,
          data: action.data
        })
      }
      return component;
    })
    default:
      return state;
  }
};
