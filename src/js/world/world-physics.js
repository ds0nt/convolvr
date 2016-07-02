export default class WorldPhysics {
	constructor(system) {
    var physicsWorker = new Worker('/js/physics.js');
      physicsWorker.onmessage = function (event) {
        var data = JSON.parse(event.data),
          sys = app,
          cam = three.camera,
          user = sys.user,
          position = [],
          velocity = [];

        if (data.command == "update") {
          physicsWorker.postMessage('{"command":"update","data":{"position":['+cam.position.x+
          ','+cam.position.y+
          ','+cam.position.z+
          '],"velocity":['+user.velocity.x+
          ','+user.velocity.y+
          ','+user.velocity.z+'], "coords": ['+sys.chunkCoords[0]+','+sys.chunkCoords[1]+','+sys.chunkCoords[2]+']}}');

        } else if (data.command == "collision") {
          console.log("collision");
          console.log(data.data);

        } else if (data.command == "chunk collision") {
          //console.log("chunk collision");
          //console.log(data.data);
          three.camera.position.set(data.data.position[0], data.data.position[1], data.data.position[2]);
					app.user.velocity.x *= -0.95;
					app.user.velocity.y *= -0.95;
					app.user.velocity.z *= -0.95;

        } else if (data.command == "user collision") {
          console.log("user collision");
          console.log(data.data);

        } else if (data.command == "building collision") {
          position = data.data.position;
          if (sys.tcl && data.data.inner == 0) {
            sys.user.falling = false;
            if (data.data.delta[0] > data.data.delta[1]) {
              three.camera.position.x = position[0];
              UserInput.device.velocity.x *= -0.85;

            } else {
              three.camera.position.z = position[2];
              UserInput.device.velocity.z *= -0.85;
            }
          }
          sys.vibrate(50);
        } else if (data.command == "load interior") {
          console.log("load interior... ", data.data.name);
          world.loadInterior(data.data.name);

        } else if (data.command == "enter interior") {
          if (data.data.name != sys.venue) {
            //console.log("data.data.name", data.data.name);
            sys.venue = data.data.name;
            world.enterInterior(data.data.name);
          }
        } else {
          console.log(data);
        }

      };

      physicsWorker.postMessage('{"command":"start","data":""}');

      return physicsWorker;
  }

}
