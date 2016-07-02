import {
    ADD_PAGE,
    FETCH_PAGES,
    FAILED_FETCH_PAGES,
    RECIEVE_PAGES,
    UPDATE_PAGE,
    DELETE_PAGE
} from '../constants/action-types';

module.exports = function pages (state = {
    currentPage: "",
    all: []
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

    case FETCH_PAGES:

    case FAILED_FETCH_PAGES:

    case RECIEVE_PAGES:
    return Object.assign({}, state, {
            all: action.pages
        })
    case UPDATE_PAGE:
    return state.map((page, index) => {
      if (index === action.index) {
        return Object.assign({}, page, {
            title: action.title,
            body: action.body,
            nav: action.nav
        })
      }
      return page;
    })
    default:
      return state;
  }
};
