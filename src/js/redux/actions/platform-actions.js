import {
    ADD_PLATFORM,
    FETCH_PLATFORMS,
    RECEIVE_PLATFORMS,
    FAILED_FETCH_PLATFORMS,
    UPDATE_PLATFORM,
    DELETE_PLATFORM
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'

export function addPlatform () {
    return {
        type: ADD_PLATFORM
    }
}
export function fetchPlatforms (id) {
    return dispatch => {
         dispatch({
            type: FETCH_PLATFORMS,
            id: id
         });
     return axios.get(API_SERVER+"/api/platforms"+id)
        .then(response => {
            dispatch(receivePlatforms(response))
        }).catch(response => {
            dispatch(failedFetchPlatforms(response))
        });
   }
}
export function receivePlatforms (platforms) {
    return {
        type: RECEIVE_PLATFORMS,
        platforms: platforms
    }
}
export function failedFetchPlatforms (err) {
    return {
        type: FAILED_FETCH_PLATFORMS,
        err: err
    }
}
export function updatePlatform (id, data) {
    return {
        type: UPDATE_PLATFORM,
        data: data,
        id: id
    }
}
export function deletePlatform (id) {
    return {
        type: DELETE_PLATFORM
    }
}
