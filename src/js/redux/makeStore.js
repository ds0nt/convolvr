import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import createLogger from 'redux-logger'
const loggerMiddleware = createLogger()

import { combineReducers } from 'redux'
import components from './reducers/component'
import platforms from './reducers/platform'
import tracks from './reducers/track'
import routers from './reducers/router'
import users from './reducers/user'
import npcs from './reducers/npc'
import avatars from './reducers/avatar'
import patterns from './reducers/pattern'
import tools from './reducers/tool'
import entities from './reducers/entity'
import pagess from './reducers/page'
import messages from './reducers/message'
import files from './reducers/file'

export default function configureStore(router, initialState = {}) {
  return createStore(
        combineReducers({
            routing: router,
                     components,
                     platforms,
                     tracks,
                     routers,
                     users,
                     npcs,
                     avatars,
                     patterns,
                     tools,
                     entities,
                     pagess,
                     messages,
                     files
        }),
        initialState,
        applyMiddleware(
            ReduxThunk,
            loggerMiddleware
        )
  )
}
