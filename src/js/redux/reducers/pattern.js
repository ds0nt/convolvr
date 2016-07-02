import {
    NEXT_PATTERN,
    PREVIOUS_PATTERN,
    ADD_PATTERN,
    GET_PATTERN,
    GET_ALL_PATTERNS,
    UPDATE_PATTERN,
    DELETE_PATTERN
} from '../constants/action-types';

module.exports = function patterns (state = {
    all: [],
    current: null
}, action) {
  switch (action.type) {
    case ADD_PATTERN:
      return Object.assign({}, state, {
        all: [
          ...state.all,
          {
            name: action.name,
            data: action.data
          }
        ]
      })
    case NEXT_PATTERN:

    case PREVIOUS_PATTERN:

    case DELETE_PATTERN:

    case GET_PATTERN:

    case GET_ALL_PATTERNS:

    case UPDATE_PATTERN:
    return state.all.map((pattern, index) => {
      if (index === action.index) {
        return Object.assign({}, pattern, {
          name: action.name,
          data: action.data
        })
      }
      return pattern;
    })
    default:
      return state;
  }
};
