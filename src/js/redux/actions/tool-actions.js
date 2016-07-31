import {
    ADD_TOOL,
    FETCH_TOOLS,
    RECEIVE_TOOLS,
    FAILED_FETCH_TOOLS,
    UPDATE_TOOL,
    DELETE_TOOL,
    NEXT_TOOL,
    PREVIOUS_TOOL,
    SELECT_TOOL
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'

export function addTool (data) {
    return {
        type: ADD_TOOL,
        data: data
    }
}
export function selectTool (id) {
    return {
        type: SELECT_TOOL,
        id: id
    }
}
export function nextTool () {
    return {
        type: NEXT_TOOL
    }
}
export function previousTool () {
    return {
        type: PREVIOUS_TOOL
    }
}
export function fetchTools (id) {
    return dispatch => {
     dispatch({
         type: FETCH_TOOLS,
         id: id
     })
     return axios.get(API_SERVER+"/api/tools"+id)
        .then(response => {
            dispatch(receiveTools(response))
        }).catch(response => {
            dispatch(failedFetchTools(response))
        });
   }
}
export function requestTools (tools) {
    return {
        type: REQUEST_TOOLS,
        tools: tools
    }
}

export function receiveTools (tools) {
    return {
        type: RECEIVE_TOOLS,
        tools: tools
    }
}

export function failedFetchTools (err) {
    return {
        type: FAILED_FETCH_TOOLS,
        err: err
    }
}

export function updateTool (id, data) {
    return {
        type: UPDATE_TOOL,
        data: data,
        id: id
    }
}

export function deleteTool (id) {
    return {
        type: DELETE_TOOL
    }
}
