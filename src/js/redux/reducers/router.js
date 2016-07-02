import {
    ADD_ROUTER,
    GET_ROUTER,
    GET_ALL_ROUTERS,
    UPDATE_ROUTER, 
    DELETE_ROUTER
} from '../constants/action-types';

module.exports = function routers (state = [], action) {
  switch (action.type) {
    case ADD_ROUTER:
      return [
        ...state,
        {
          name: action.url,
          data: action.data,
          pic: action.pic
        }
      ]
    case DELETE_ROUTER:

    case GET_ROUTER:

    case GET_ALL_ROUTERS:

    case UPDATE_ROUTER:
    return state.map((router, index) => {
      if (index === action.index) {
        return Object.assign({}, router, {
          name: action.url,
          data: action.data,
          pic: action.pic
        })
      }
      return router;
    })
    default:
      return state;
  }
};
