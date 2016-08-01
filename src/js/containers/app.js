import React, { Component } from 'react';
import { fetchPlatforms } from '../redux/actions/platform-actions'
import { homePlatformInit } from '../redux/actions/platform-actions'
import { fetchTracks } from '../redux/actions/track-actions'
import { fetchUsers } from '../redux/actions/user-actions'
//store.dispatch(fetchPlatforms());
//store.dispatch(fetchTracks());
//store.dispatch(fetchUsers());

class App extends Component {

  componentDidMount () {
      this.props.initHomePlatform();
  }

  render() {
    var content = "";
    if (window.location.href.split("host/").length > 1) {
    	//content = <SignIn />;
    }

    return (
        <div className="root">
            {this.props.children}
    	  	<video id="webcam" ></video>
    		<canvas id="webcam-canvas"></canvas>
            <div className="lightbox" style={{display: "none"}}></div>
        </div>
    )
  }
}

App.defaultProps = {

}

import { connect } from 'react-redux'

export default connect(
  state => {
    return {
      platforms: state.platforms,
      tracks: state.tracks,
      tools: state.tools,
      users: state.users
    }
  },
  dispatch => {
    return {
        initHomePlatform: () => {
            dispatch(homePlatformInit())
        }
    }
  }
)(App)
