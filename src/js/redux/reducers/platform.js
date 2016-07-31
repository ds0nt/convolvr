import {
    PLATFORM_ADD,
    FETCH_PLATFORMS,
    PLATFORMS_FETCH_FAILED,
    RECEIEVE_PLATFORMS,
    SET_HOME_PLATFORM,
    UPDATE_PLATFORM,
    DELETE_PLATFORM
} from '../constants/action-types';

module.exports = function platforms (state = {
    home: null,
    user: [],
    friend: [],
    group: [],
    fetching: false
}, action) {
  switch (action.type) {
    case PLATFORM_ADD:
    return Object.assign({}, state, {
        user: [
          ...state.user,
          {
            id: action.id,
            name: action.name,
            data: action.data
          }
        ]
    })
    case SET_HOME_PLATFORM:
        return Object.assign({}, state, {
            home: action.data.home
        })
    case DELETE_PLATFORM:

    case FETCH_PLATFORMS:
        return Object.assign({}, state, {
            fetching: true
        })
    case PLATFORMS_FETCH_FAILED:

    case RECEIEVE_PLATFORMS:
        return Object.assign({}, state, {
            home: action.homePlatform,
            user: action.userPlatforms,
            group: action.groupPlatforms,
            friend: action.friendPlatforms
        })
    case UPDATE_PLATFORM:
    return state.user.map((platform, index) => {
      if (index === action.index) {
        return Object.assign({}, platform, {
          id: action.url,
          name: action.name,
          data: action.data
        })
      }
      return platform;
    })
    default:
      return state;
  }
};
