import {
    ADD_FILE,
    FETCH_FILES,
    RECEIVE_FILES,
    FAILED_FETCH_FILES,
    UPDATE_FILE,
    DELETE_FILE
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'

export function addFile (name, src) {
    return {
        type: ADD_FILE,
        name: name,
        src: src
    }
}
export function fetchFiles (id) {
    return dispatch => {
     dispatch({
         type: FETCH_FILES,
         id: id
     })
     return axios.get(API_SERVER+"/api/files"+id)
        .then(response => {
            dispatch(receiveFiles(response))
        }).catch(response => {
            dispatch(failedFetchFiles(response))
        });
   }
}
export function receiveFiles (files) {
    return {
        type: RECEIVE_FILES,
        files: files
    }
}
export function failedFetchFiles (err) {
    return {
        type: FAILED_FETCH_FILES,
        err: err
    }
}
export function updateFile (id, data) {
    return {
        type: UPDATE_FILE,
        data: data,
        id: id
    }
}
export function deleteFile (id) {
    return {
        type: DELETE_FILE
    }
}
