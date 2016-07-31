import {
    ADD_ROUTER,
    FETCH_ROUTER,
    FETCH_ALL_ROUTERS,
    REQUEST_ROUTERS,
    RECEIVE_ROUTERS,
    FAILED_FETCH_ROUTERS,
    UPDATE_ROUTER,
    DELETE_ROUTER
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'

export function addRouter () {
    return {
        type: ADD_ROUTER
    }
}
export function fetchRouters (id) {
    return dispatch => {
     dispatch({
         type: FETCH_ROUTERS,
         id: id
     })
     return axios.get(API_SERVER+"/api/routers"+id)
        .then(response => {
            dispatch(receiveRouters(response))
        }).catch(response => {
            dispatch(failedFetchRouters(response))
        });
   }
}
export function requestRouters (routers) {
    return {
        type: REQUEST_ROUTERS,
        routers: routers
    }
}
export function receiveRouters (routers) {
    return {
        type: RECEIVE_ROUTERS,
        routers: routers
    }
}
export function failedFetchRouters (err) {
    return {
        type: FAILED_FETCH_ROUTERS,
        err: err
    }
}

export function updateRouter (id, data) {
    return {
        type: UPDATE_ROUTER,
        data: data,
        id: id
    }
}

export function deleteRouter (id) {
    return {
        type: DELETE_STRUCTURE
    }
}
