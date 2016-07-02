import {
    ADD_AVATAR,
    NEXT_AVATAR,
    PREVIOUS_AVATAR,
    FETCH_AVATARS,
    RECEIVE_AVATARS,
    FAILED_FETCH_AVATARS,
    UPDATE_AVATAR,
    DELETE_AVATAR
} from '../constants/action-types';

module.exports = function avatars (state = {
    types: [],
    userAvatar: "default"
}, action) {
  switch (action.type) {
    case ADD_AVATAR:
    return Object.assign({}, avatar, {
      types: [
        ...state,
        {
          name: action.data.url,
          data: action.data.data,
          pic: action.data.pic
        }
      ]
    })
    case DELETE_AVATAR:

    case NEXT_AVATAR:

    case PREVIOUS_AVATAR:

    case FETCH_AVATARS:

    case FAILED_FETCH_AVATARS:

    case RECEIVE_AVATARS:
        return Object.assign({}, state, {
            instances: action.instances
        })
    case UPDATE_AVATAR:
    return state.map((avatar, index) => {
      if (avatar.id === action.id) {
        return Object.assign({}, avatar, {
            name: action.data.url,
            data: action.data.data,
            pic: action.data.pic
        })
      }
      return avatar;
    })
    default:
      return state;
  }
};
