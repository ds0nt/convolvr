import {
    ADD_PAGE,
    PAGES_FETCH,
    PAGES_FETCH_FAIL,
    PAGES_FETCH_DONE,
    UPDATE_PAGE,
    DELETE_PAGE
} from '../constants/action-types';

module.exports = function pages (state = {
    currentPage: "",
    all: [],
    fetching: false
}, action) {
  switch (action.type) {
    case ADD_PAGE:
      return [
        ...state,
        {
          title: action.title,
          body: action.body,
          nav: action.nav
        }
      ]
    case DELETE_PAGE:

    case PAGES_FETCH:
        return Object.assign({}, state, {
            fetching: true
        })
    case PAGES_FETCH_FAIL:

    case PAGES_FETCH_DONE:
    return Object.assign({}, state, {
            all: action.pages,
            fetching: false
        })
    case UPDATE_PAGE:

    default:
      return state;
  }
};
