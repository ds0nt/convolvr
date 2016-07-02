import {
    ADD_MESSAGE,
    FETCH_MESSAGES,
    RECEIEVE_MESSAGES,
    FAILED_FETCH_MESSAGES,
    UPDATE_MESSAGE,
    DELETE_MESSAGE
} from '../constants/action-types';

module.exports = function messages (state = [], action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return [
        ...state,
        {
          id: action.id,
          to: action.to,
          from: action.from,
          sent: action.sent,
          title: action.title,
          body: action.body,
          attachments: action.attachments
        }
      ]
    case DELETE_MESSAGE:

    case FETCH_MESSAGES:

    case RECEIEVE_MESSAGES:

    case FAILED_FETCH_MESSAGES:

    case UPDATE_MESSAGE:
    return state.map((message, index) => {
      if (index === action.index) {
        return Object.assign({}, message, {
            to: action.to,
            from: action.from,
            sent: action.sent,
            title: action.title,
            body: action.body,
            attachments: action.attachments
        })
      }
      return message;
    })
    default:
      return state;
  }
};
