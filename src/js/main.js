console.log('🌀 Powering up...');
// React
import ReactDOM from 'react-dom';
import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
// Redux
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import makeStore from './redux/makeStore'
import App from './containers/app'
import HUD from './containers/hud'

let store = makeStore(routerReducer);
const history = syncHistoryWithStore(browserHistory, store)

// UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { indigo500, indigo600, amber800, amber500 } from 'material-ui/styles/colors'

// World
import UserInput from './input/user-input.js';
import io from 'socket.io-client'

//import SocketEvents from './socket-events.js';
//import WorldPhysics from './world/world-physics.js';
import World from './world/world.js';
//import Avatar from './world/avatar.js';

var token = localStorage.getItem("token"),
		userInput,
		world,
		avatar = null;

	userInput = new UserInput();
	world = new World(userInput);
	userInput.init(world, world.camera, {mesh:new THREE.Object3D(), velocity: new THREE.Vector3()});
	userInput.rotationVector = {x: 6.153333333333329, y: -12.121666666666789, z: 0};

const muiTheme = getMuiTheme({
      palette: {
          primary1Color: indigo500,
          primary2Color: indigo600,
          accent1Color: amber800,
          accent2Color: amber500,
      },
      appBar: {
        height: 50,
      }
    });

ReactDOM.render(
  (<Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
		<Router history={history}>
	  		<Route path="/" component={App} >
				<IndexRoute component={HUD}/>
			</Route>
		</Router>
    </MuiThemeProvider>
  </Provider>),
  document.getElementsByTagName('main')[0]
)
