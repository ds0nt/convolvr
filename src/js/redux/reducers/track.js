import {
    ADD_TRACK,
    FETCH_TRACKS,
    RECIEVE_TRACKS,
    FAILED_FETCH_TRACKS,
    UPDATE_TRACK,
    DELETE_TRACK
} from '../constants/action-types';

module.exports = function tracks (state = [], action) {
  switch (action.type) {
    case ADD_TRACK:
      return [
        ...state,
        {
          name: action.url,
          data: action.data,
          pic: action.pic
        }
      ]
    case DELETE_TRACK:

    case FETCH_TRACKS:

    case FAILED_FETCH_TRACKS:

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
