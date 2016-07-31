import {
    COMPONENT_ADD,
    COMPONENTS_FETCH,
    COMPONENTS_FETCH_DONE,
    COMPONENTS_FETCH_FAILED,
    UPDATE_COMPONENT,
    DELETE_COMPONENT
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'

export function addComponent (name, data) {
    return {
        type: COMPONENT_ADD,
        name: name,
        data: data
    }
}
export function fetchComponents (id) {
    return dispatch => {
     dispatch({
         type: COMPONENTS_FETCH,
         id: id
     })
     return axios.get(API_SERVER+"/api/components"+id)
        .then(response => {
            dispatch(doneFetchComponents(response))
        }).catch(response => {
            dispatch(failedFetchComponents(response))
        });
   }
}
export function doneFetchComponents (components) {
    return {
        type: COMPONENTS_FETCH_DONE,
        components: components
    }
}
export function failedFetchComponents (err) {
    return {
        type: COMPONENTS_FETCH_FAILED,
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
