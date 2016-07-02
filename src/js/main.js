console.log('🌀 Spinning up turbines...');
// React
import ReactDOM from 'react-dom';
import React, { Component, PropTypes } from 'react';
// Redux
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import makeStore from './redux/makeStore'
import App from './containers/app'
import { fetchPlatforms } from './redux/actions/platform-actions'
import { fetchTracks } from './redux/actions/track-actions'
import { fetchUsers } from './redux/actions/user-actions'
let store = makeStore({});

// UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { indigo500, indigo600, amber800, amber500 } from 'material-ui/styles/colors'

// World
import UserInput from './input/user-input.js';
//import SocketEvents from './socket-events.js';
//import WorldPhysics from './world/world-physics.js';
import World from './world/world.js';
//import Avatar from './world/avatars/default.js';

var token = localStorage.getItem("token"),
	world = new World(),
	avatar = null,
	userInput = null;

dispatch(fetchPlatforms());
dispatch(fetchTracks());
dispatch(fetchUsers());

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
        <App />
    </MuiThemeProvider>
  </Provider>),
  document.getElementsByTagName('main')[0]
)
