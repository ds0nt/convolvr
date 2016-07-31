/* structure actions */
import {
    ADD_USER,
    USER_CONNECT,
    USER_DISCONNECT,
    FETCH_USERS,
    RECEIVE_USERS,
    FAILED_FETCH_USERS,
    UPDATE_USER,
    DELETE_USER
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'

export function addUser () {
    return {
        type: ADD_USER
    }
}
export function userConnect (id) {
    return {
        type: USER_CONNECT,
        id: id
    }
}
export function userDisconnect (id) {
    return {
        type: USER_DISCONNECT,
        id
    }
}
export function fetchUsers (id) {
    return dispatch => {
     dispatch({
         type: FETCH_USERS,
         id: id
     })
     return axios.get(API_SERVER+"/api/users/"+id)
        .then(response => {
            dispatch(receiveUsers(response))
        }).catch(response => {
            dispatch(failedFetchUsers(response))
        });
   }
}
export function receiveUsers (users) {
    return {
        type: RECEIVE_USERS,
        users: users
    }
}
export function failedFetchUsers (err) {
    return {
        type: FAILED_FETCH_USERS,
        err: err
    }
}
export function updateUser (id, data) {
    return {
        type: UPDATE_USER,
        data: data,
        id: id
    }
}
export function deleteUser (id) {
    return {
        type: DELETE_USER
    }
}
