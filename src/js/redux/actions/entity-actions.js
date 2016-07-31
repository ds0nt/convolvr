import {
    ENTITY_ADD,
    ENTITIES_FETCH
    ENTITIES_FETCH_DONE,
    ENTITIES_FETCH_FAILED,
    UPDATE_ENTITY,
    DELETE_ENTITY
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'

export function addEntity (id, name, components) {
    return {
        type: ENTITY_ADD,
        id: id,
        name: name,
        components: components
    }
}
export function fetchEntities (id) {
    return dispatch => {
     dispatch({
         type: ENTITIES_FETCH,
         id: id
     })
     return axios.get(API_SERVER+"/api/entities"+id)
        .then(response => {
            dispatch(doneFetchEntities(response))
        }).catch(response => {
            dispatch(failedFetchEntities(response))
        });
   }
}
export function doneFetchEntities (entities) {
    return {
        type: ENTITIES_FETCH_DONE,
        entities: entities
    }
}
export function failedFetchEntities (err) {
    return {
        type: ENTITIES_FETCH_FAILED,
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
