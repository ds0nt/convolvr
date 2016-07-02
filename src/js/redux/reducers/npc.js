import {
    ADD_NPC,
    FETCH_NPCS,
    RECEIEVE_NPCS,
    FAILED_FETCH_NPCS,
    UPDATE_NPC,
    DELETE_NPC
} from '../constants/action-types';

module.exports = function npcs (state = [], action) {
  switch (action.type) {
    case ADD_NPC:
      return [
        ...state,
        {
          name: action.data.url,
          data: action.data.data,
          pic: action.data.pic
        }
      ]
    case DELETE_NPC:

    case FETCH_NPCS:

    case RECEIEVE_NPCS:
        return Object.assign({}, state, {
            instances: action.instances
        })
    case FAILED_FETCH_NPCS:

    case UPDATE_NPC:
    return state.map((npc, index) => {
      if (index === action.index) {
        return Object.assign({}, npc, {
          name: action.data.url,
          data: action.data.data,
          pic: action.data.pic
        })
      }
      return npc;
    })
    default:
      return state;
  }
};
