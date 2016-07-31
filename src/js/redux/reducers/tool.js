import {
    TOOL_ADD,
    FETCH_TOOLS,
    RECEIVE_TOOLS,
    FAILED_FETCH_TOOLS,
    NEXT_TOOL,
    PREVIOUS_TOOL,
    UPDATE_TOOL,
    DELETE_TOOL
} from '../constants/action-types';

module.exports = function tools (state = [], action) {
  switch (action.type) {
    case TOOL_ADD:
      return [
        ...state,
        {
          name: action.url,
          data: action.data,
          pic: action.pic
        }
      ]
    case NEXT_TOOL:

    case PREVIOUS_TOOL:

    case DELETE_TOOL:

    case FETCH_TOOLS:

    case RECEIVE_TOOLS:

    case FAILED_FETCH_TOOLS:

    case UPDATE_TOOL:
    return state.map((tool, index) => {
      if (index === action.index) {
        return Object.assign({}, tool, {
          name: action.url,
          data: action.data,
          pic: action.pic
        })
      }
      return tool;
    })
    default:
      return state;
  }
};
