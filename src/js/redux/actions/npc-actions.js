import {
    ADD_NPC,
    FETCH_NPCS,
    RECEIVE_NPCS,
    FAILED_FETCH_NPCS,
    UPDATE_NPC,
    DELETE_NPC
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'

export function addNPC () {
    let physicsWorld = three.world.worldPhysics.worker; // until I can find a better way to access this

    return {
        type: ADD_NPC
    }
}
export function deleteNPC (id) {
    let physicsWorld = three.world.worldPhysics.worker; // until I can find a better way to access this

    return {
        type: DELETE_NPC
    }
}
export function fetchNPCs (id) {
    return dispatch => {
     dispatch({
         type: FETCH_NPCS,
         id: id
     })
     return axios.get(API_SERVER+"/api/files"+id)
        .then(response => {
            dispatch(receiveNPCs(response))
        }).catch(response => {
            dispatch(failedFetchNPCs(response))
        });
   }
}
export function receiveNPCs (files) {
    return {
        type: RECEIVE_NPCS,
        files: files
    }
}
export function failedFetchNPCs (err) {
    return {
        type: FAILED_FETCH_NPCS,
        err: err
    }
}
export function updateNPC (id, data) {
    return {
        type: UPDATE_NPC,
        data: data,
        id: id
    }
}
