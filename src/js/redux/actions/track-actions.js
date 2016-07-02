/* structure actions */
import {
    ADD_TRACK,
    FETCH_TRACKS,
    RECEIVE_TRACKS,
    FAILED_FETCH_TRACKS,
    UPDATE_TRACK,
    DELETE_TRACK
} from '../constants/action-types';
import axios from 'axios';

export function addTrack () {
    return {
        type: ADD_TRACK
    }
}
export function fetchTracks (id) {
    return dispatch => {
     dispatch({
         type: FETCH_TRACKS,
         id: id
     })
     return axios.get("http://localhost:3600/api/tracks"+id)
        .then(response => {
            dispatch(receiveTracks(response))
        }).catch(response => {
            dispatch(failedFetchTracks(response))
        });
   }
}
export function receiveTracks (tracks) {
    return {
        type: RECEIVE_TRACKS,
        tracks: tracks
    }
}
export function failedFetchTracks (err) {
    return {
        type: FAILED_FETCH_TRACKS,
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
