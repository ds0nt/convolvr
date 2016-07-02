import {
    ADD_COMPONENT,
    FETCH_COMPONENTS,
    RECEIVE_COMPONENTS,
    FAILED_FETCH_COMPONENTS,
    UPDATE_COMPONENT,
    DELETE_COMPONENT
} from '../constants/action-types';
import axios from 'axios';

export function addComponent (name, data) {
    return {
        type: ADD_COMPONENT,
        name: name,
        data: data
    }
}
export function fetchComponents (id) {
    return dispatch => {
     dispatch({
         type: FETCH_COMPONENTS,
         id: id
     })
     return axios.get("http://localhost:3600/api/components"+id)
        .then(response => {
            dispatch(receiveComponents(response))
        }).catch(response => {
            dispatch(failedFetchComponents(response))
        });
   }
}
export function receiveComponents (components) {
    return {
        type: RECEIVE_COMPONENTS,
        components: components
    }
}
export function failedFetchComponents (err) {
    return {
        type: FAILED_FETCH_COMPONENTS,
        err: err
    }
}
export function updateComponent (id, name, data) {
    return {
        type: UPDATE_COMPONENT,
        name: name,
        data: data,
        id: id
    }
}
export function deleteComponent (id) {
    return {
        type: DELETE_COMPONENT
    }
}
