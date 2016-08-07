export default class WorldPhysics {
	constructor() {
		this.worker = null;
	}

	init (world) {
		let worker = new Worker('/js/workers/physics.js');
	      worker.onmessage = function (event) {
	        let message = JSON.parse(event.data),
	          sys = world,
	          cam = three.camera,
	          user = sys.user,
	          position = [],
	          velocity = [];

	        if (message.command == "update") {
	          worker.postMessage('{"command":"update","data":{"position":['+cam.position.x+
	          ','+cam.position.y+
	          ','+cam.position.z+
	          '],"velocity":['+user.velocity.x+
	          ','+user.velocity.y+
	          ','+user.velocity.z+'] }}');

		  } else if (message.command == "collision") {
	          console.log("collision");
	          console.log(message.data);
		  } else if (message.command == "platform collision") {
	          console.log(message.command);
	          //console.log(data.data);
	          three.camera.position.set(message.data.position.x, message.data.position.y, message.data.position.z);
			  sys.user.velocity.x *= -0.95;
			  sys.user.velocity.y *= -0.95;
			  sys.user.velocity.z *= -0.95;

		  } else if (message.command == "user collision") {
	          console.log(message.data);

		  } else if (message.command == "building collision") {
	          position = message.data.position;
	          if (sys.tcl && message.data.inner == 0) {
	            sys.user.falling = false;
	            if (message.data.delta[0] > message.data.delta[1]) {
	              three.camera.position.x = position[0];
	              UserInput.device.velocity.x *= -0.85;

	            } else {
	              three.camera.position.z = position[2];
	              UserInput.device.velocity.z *= -0.85;
	            }
	          }
	          sys.vibrate(50);
	        } else if (data.command == "load interior") {
	          console.log("load interior... ", message.data.name);
	          world.loadInterior(message.data.name);

	        } else if (data.command == "enter interior") {
	          if (message.data.name != sys.venue) {
	            //console.log("message.data.name", data.data.name);
	            sys.venue = message.data.name;
	            world.enterInterior(message.data.name);
	          }
	        } else {
	          console.log(data);
	        }

	      };

	      worker.postMessage('{"command":"start","data":""}');
		  this.worker = worker;
		  return worker;
	}

}
