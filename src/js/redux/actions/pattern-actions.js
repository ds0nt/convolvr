import {
    ADD_PATTERN,
    FETCH_PATTERNS,
    RECEIVE_PATTERNS,
    FAILED_FETCH_PATTERNS,
    UPDATE_PATTERN,
    DELETE_PATTERN,
    NEXT_PATTERN,
    PREVIOUS_PATTERN,
    SELECT_PATTERN
} from '../constants/action-types';
import axios from 'axios';

export function addPattern () {
    return {
        type: ADD_PATTERN
    }
}
export function selectPattern (id) {
    return {
        type: SELECT_PATTERN,
        id: id
    }
}
export function nextPattern () {
    return {
        type: NEXT_PATTERN
    }
}
export function previousPattern () {
    return {
        type: PREVIOUS_PATTERN
    }
}
export function fetchPatterns (id) {
    return dispatch => {
     dispatch({
         type: FETCH_PATTERNS,
         id: id
     })
     return axios.get("http://localhost:3600/api/patterns"+id)
        .then(response => {
            dispatch(receivePatterns(response))
        }).catch(response => {
            dispatch(failedFetchPatterns(response))
        });
   }
}
export function requestPatterns (patterns) {
    return {
        type: REQUEST_PATTERNS,
        patterns: patterns
    }
}
export function receivePatterns (patterns) {
    return {
        type: RECEIVE_PATTERNS,
        patterns: patterns
    }
}
export function failedFetchPatterns (err) {
    return {
        type: FAILED_FETCH_PATTERNS,
        err: err
    }
}
export function updatePattern (id, data) {
    return {
        type: UPDATE_PATTERN,
        data: data,
        id: id
    }
}
export function deletePattern (id) {
    return {
        type: DELETE_PATTERN
    }
}
