import {
    USER_ADD,
    USERS_FETCH,
    USERS_FETCH_DONE,
    USERS_FETCH_FAIL,
    USER_CONNECT,
    USER_DISCONNECT,
    UPDATE_USER,
    DELETE_USER,
    LOGIN_FETCH,
    LOGIN_DONE,
    LOGIN_FAIL
} from '../constants/action-types';

module.exports = function users (state = {
    current: null,
    all: [],
    fetching: false
}, action) {
  switch (action.type) {
    case USER_ADD:

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

    case USERS_FETCH:
        return Object.assign({}, state, {
            fetching: true
        })
    case USERS_FETCH_DONE:
        return Object.assign({}, state, {
            fetching: false,
            all: action.data.users
        })
    case USERS_FETCH_FAIL:

    case UPDATE_USER:
    case LOGIN_FETCH:
    return Object.assign({}, state, {
        fetching: true
    })
    case LOGIN_DONE:
    return Object.assign({}, state, {
            fetching: false,
            current: action.data.user
    })
    case LOGIN_FAIL:
    return Object.assign({}, state, {
        fetching: false
    })

    default:
      return state;
  }
};
