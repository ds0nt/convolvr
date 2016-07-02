import {
    ADD_ENTITY,
    FETCH_ENTITIES
    RECEIVE_ENTITIES,
    FAILED_FETCH_ENTITIES,
    UPDATE_ENTITY,
    DELETE_ENTITY
} from '../constants/action-types';
import axios from 'axios';

export function addEntity (id, name, components) {
    return {
        type: ADD_ENTITY,
        id: id,
        name: name,
        components: components
    }
}
export function fetchEntities (id) {
    return dispatch => {
     dispatch({
         type: FETCH_ENTITIES,
         id: id
     })
     return axios.get("http://localhost:3600/api/entities"+id)
        .then(response => {
            dispatch(receiveEntities(response))
        }).catch(response => {
            dispatch(failedFetchEntities(response))
        });
   }
}
export function receiveEntities (entities) {
    return {
        type: RECEIVE_ENTITIES,
        entities: entities
    }
}
export function failedFetchEntities (err) {
    return {
        type: FAILED_FETCH_ENTITIES,
        err: err
    }
}
export function updateEntity (id,  name, components) {
    return {
        type: UPDATE_ENTITY,
        id: id,
        name: name,
        components: components
    }
}
export function deleteEntity (id) {
    return {
        type: DELETE_ENTITY,
        id: id
    }
}
