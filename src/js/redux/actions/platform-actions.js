import {
    PLATFORM_ADD,
    FETCH_PLATFORMS,
    RECEIVE_PLATFORMS,
    PLATFORMS_FETCH_FAILED,
    UPDATE_PLATFORM,
    DELETE_PLATFORM,
    PLATFORM_HOME_INIT
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'
import Platform from '../../world/platform.js'

export function addPlatform () {
    let physicsWorld = three.world.worldPhysics.worker;

    return {
        type: PLATFORM_ADD
    }
}
export function deletePlatform (id) {
    let physicsWorld = three.world.worldPhysics.worker;
    physicsWorld.postMessage(JSON.stringify({
        command: "remove platform",
        data: id
    }))
    return {
        type: DELETE_PLATFORM
    }
}
export function homePlatformInit () {
    let physicsWorld = three.world.worldPhysics.worker,
        platform = new Platform();
    physicsWorld.postMessage(JSON.stringify({
        command: "add platforms",
        data: [
            platform.data
        ]
    }))
    return {
        type: PLATFORM_HOME_INIT,
        platform: platform
    }
}
export function fetchPlatforms (id) {
    return dispatch => {
         dispatch({
            type: FETCH_PLATFORMS,
            id: id
         });
     return axios.get(API_SERVER+"/api/platforms/"+id)
        .then(response => {
            dispatch(doneFetchPlatforms(response))
        }).catch(response => {
            dispatch(failedFetchPlatforms(response))
        });
   }
}
export function doneFetchPlatforms (platforms) {
    platforms.map(data => {
        var platform = new Platform(data);
        physicsWorld.postMessage(JSON.stringify({
            command: "add platforms",
            data: [
                platform.data
            ]
        }))
    })
    return {
        type: RECEIVE_PLATFORMS,
        platforms: platforms
    }
}
export function failedFetchPlatforms (err) {
    return {
        type: PLATFORMS_FETCH_FAILED,
        err: err
    }
}
export function updatePlatform (id, data) {
    return {
        type: UPDATE_PLATFORM,
        data: data,
        id: id
    }
}
