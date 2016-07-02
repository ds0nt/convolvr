import { combineReducers } from 'redux'
import components from './component'
import platforms from './platform'
import tracks from './track'
import routers from './router'
import users from './user'
import npcs from './npc'
import avatars from './avatar'
import patterns from './pattern'
import tools from './tool'
import entities from './entity'
import pagess from './page'
import messages from './message'
import files from './file'

const AppState = combineReducers({
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
});

export default AppState;
