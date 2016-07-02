import React, { Component } from 'react';
export default class App extends Component {
  render() {
    var content = "";
    if (window.location.href.split("host/").length > 1) {
    	content = <SignIn />;
    }

    return (
        <div className="root">
    	  	<video id="webcam" ></video>
    		<canvas id="webcam-canvas"></canvas>
            <div className="lightbox" style={{display: "none"}}></div>
        </div>
    )
  }
}

App.defaultProps = {

}
