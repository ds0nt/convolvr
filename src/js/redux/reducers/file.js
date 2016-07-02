import {
    ADD_FILE,
    FETCH_FILES,
    FAILED_FETCH_FILES,
    RECEIEVE_FILES,
    UPDATE_FILE,
    DELETE_FILE
} from '../constants/action-types';

module.exports = function files (state = [], action) {
  switch (action.type) {
    case ADD_FILE:
      return [
        ...state,
        {
          id: action.id,
          name: action.name,
          public: action.public,
          tags: action.tags
        }
      ]
    case DELETE_FILE:

    case FETCH_FILES:

    case RECEIEVE_FILES:

    case FAILED_FETCH_FILES:

    case UPDATE_FILE:
    return state.map((file, index) => {
      if (index === action.id) {
        return Object.assign({}, file, {
            name: action.name,
            public: action.public,
            tags: action.tags
        })
      }
      return file;
    })
    default:
      return state;
  }
};
