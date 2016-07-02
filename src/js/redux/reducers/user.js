import {
    ADD_USER,
    FETCH_USERS,
    RECIEVE_USERS,
    FAILED_FETCH_USERS,
    USER_CONNECT,
    USER_DISCONNECT,
    UPDATE_USER,
    DELETE_USER
} from '../constants/action-types';

module.exports = function users (state = {
    current: null,
    all: []
}, action) {
  switch (action.type) {
    case ADD_USER:

      return [

      ]
    case USER_CONNECT:
        return Object.assign({}, state, {
          all: [
              ...state.all,
              {
                name: action.name,
                data: action.data,
                pic: action.pic
              }
          ]
        })
    case USER_DISCONNECT:

    case DELETE_USER:

    case FETCH_USERS:

    case RECIEVE_USERS:

    case FAILED_FETCH_USERS:

    case UPDATE_USER:
    return state.all.map((user, index) => {
      if (index === action.index) {
        return Object.assign({}, user, {
            name: action.name,
            data: action.data,
            pic: action.pic
        })
      }
      return user;
    })
    default:
      return state;
  }
};
