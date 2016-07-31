import {
    ADD_PAGE,
    FETCH_PAGES,
    RECEIVE_PAGES,
    FAILED_FETCH_PAGES,
    UPDATE_PAGE,
    DELETE_PAGE
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'

export function addPage () {
    return {
        type: ADD_PAGE
    }
}
export function fetchPages (id) {
    return dispatch => {
     dispatch({
        type: FETCH_PAGES,
        id: id
     })
     return axios.get(API_SERVER+"/api/pages"+id)
        .then(response => {
            dispatch(receivePages(response))
        }).catch(response => {
            dispatch(failedFetchPages(response))
        });
   }
}
export function receivePages (pages) {
    return {
        type: RECEIVE_PAGES,
        pages: pages
    }
}
export function failedFetchPages (err) {
    return {
        type: FAILED_FETCH_PAGES,
        err: err
    }
}
export function updatePage (id, data) {
    return {
        type: UPDATE_PAGE,
        data: data,
        id: id
    }
}
export function deletePage (id) {
    return {
        type: DELETE_PAGE
    }
}
