/* structure actions */
import {
    TRACK_ADD,
    TRACKS_FETCH,
    TRACKS_FETCH_DONE,
    TRACKS_FETCH_FAIL,
    UPDATE_TRACK,
    DELETE_TRACK
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'

export function addTrack () {
    return {
        type: TRACK_ADD
    }
}
export function fetchTracks (id) {
    return dispatch => {
     dispatch({
         type: TRACKS_FETCH,
         id: id
     })
     return axios.get(API_SERVER+"/api/tracks"+id)
        .then(response => {
            dispatch(doneFetchTracks(response))
        }).catch(response => {
            dispatch(failedFetchTracks(response))
        });
   }
}
export function doneFetchTracks (tracks) {
    return {
        type: TRACKS_FETCH_DONE,
        tracks: tracks
    }
}
export function failedFetchTracks (err) {
    return {
        type: TRACKS_FETCH_FAIL,
        err: err
    }
}
export function updateTrack (id, data) {
    return {
        type: UPDATE_TRACK,
        data: data,
        id: id
    }
}
export function deleteTrack (id) {
    return {
        type: DELETE_TRACK
    }
}
