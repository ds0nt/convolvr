import {
    TRACK_ADD,
    TRACKS_FETCH,
    TRACKS_FETCH_DONE,
    TRACKS_FETCH_FAIL,
    UPDATE_TRACK,
    DELETE_TRACK
} from '../constants/action-types';

module.exports = function tracks (state = [], action) {
  switch (action.type) {
    case TRACK_ADD:
      return [
        ...state,
        {
          name: action.url,
          data: action.data,
          pic: action.pic
        }
      ]
    case DELETE_TRACK:

    case TRACKS_FETCH:
        return Object.assign({}, state, {
            fetching: true
        })
    case TRACKS_FETCH_FAIL:

    case UPDATE_TRACK:
    return state.map((track, index) => {
      if (index === action.index) {
        return Object.assign({}, track, {
          name: action.url,
          data: action.data,
          pic: action.pic
        })
      }
      return track;
    })
    default:
      return state;
  }
};
