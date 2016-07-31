import {
    ADD_PAGE,
    PAGES_FETCH,
    PAGES_FETCH_DONE,
    PAGES_FETCH_FAIL,
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
        type: PAGES_FETCH,
        id: id
     })
     return axios.get(API_SERVER+"/api/pages"+id)
        .then(response => {
            dispatch(doneFetchPages(response))
        }).catch(response => {
            dispatch(failedFetchPages(response))
        });
   }
}
export function doneFetchPages (pages) {
    return {
        type: PAGES_FETCH_DONE,
        pages: pages
    }
}
export function failedFetchPages (err) {
    return {
        type: PAGES_FETCH_FAIL,
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
