import {
    ADD_MESSAGES,
    FETCH_MESSAGES,
    RECEIVE_MESSAGES,
    FAILED_FETCH_MESSAGES,
    UPDATE_MESSAGE,
    DELETE_MESSAGE
} from '../constants/action-types';
import axios from 'axios';

export function addMessage () {
    return {
        type: ADD_MESSAGE
    }
}
export function fetchMESSAGES (id) {
    return dispatch => {
     dispatch({
         type: FETCH_MESSAGES,
         id: id
     })
     return axios.get("http://localhost:3600/api/files"+id)
        .then(response => {
            dispatch(receiveMESSAGES(response))
        }).catch(response => {
            dispatch(failedFetchMESSAGES(response))
        });
   }
}
export function receiveMESSAGES (files) {
    return {
        type: RECEIVE_MESSAGES,
        files: files
    }
}
export function failedFetchMESSAGES (err) {
    return {
        type: FAILED_FETCH_MESSAGES,
        err: err
    }
}
export function updateMESSAGE (id, data) {
    return {
        type: UPDATE_MESSAGE,
        data: data,
        id: id
    }
}
export function deleteMESSAGE (id) {
    return {
        type: DELETE_MESSAGE
    }
}
