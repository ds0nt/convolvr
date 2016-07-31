/*  Pylon Desktop | physics.js
Jeremy Evans Openspacehexagon@gmail.com
*/
var observer = {
		position: [0, 0, 0],
		prevPos: [0, 0, 0],
		velocity: [0, 0, 0],
		coords: [0, 0, 0]
	},
	objects = [],
	chunks = [],
	buildings = [],
	actors = [];

function CollisionObject (data) {
	this.data = data;
	this.name = data.name;
	this.position = data.position;
}

function CollisionBuilding (data) {
	this.data = data;
	this.name = data.name;
	this.position = data.position;
	this.interiorLoaded = false;
}

function distance3d (a, b) {
	return Math.sqrt(Math.pow((a[0]-b[0]),2) + Math.pow((a[1]-b[1]),2) + Math.pow((a[2]-b[2]),2));
}

function distance2d (a, b) {
	return Math.sqrt(Math.pow((a[0]-b[0]),2)+Math.pow((a[2]-b[2]),2));
}

self.update = function () {
	var objectCollision = false,
			entities = [],
			distance = 0,
			position = observer.position,
			coords = observer.coords,
			i = 0,
			size = 2600,
			obj = null,
			delta = [0, 0],
			innerBox = [false, false],
			oPos = [],
			speed = 0,
			velocity = observer.velocity,
			closeToVenue =  false,
			chunkDimensions = [6150 * 6, 3200 * 6 * Math.sqrt(3)],
			i = chunks.length -1,
			cKey = "";

		entities = objects;

	for (cKey in chunks) {
		obj = chunks[cKey];

			if (obj.coords[0] == coords[0] && obj.coords[1] == coords[1]) {
				if (position[1] < obj.position[1] + 2400 && position[1] > obj.position[1] ) {
					if (position[0] > obj.position[0]  && position[2] > obj.position[2] && position[0] < obj.position[0] + chunkDimensions[0] && position[2] < obj.position[2] + chunkDimensions[1]) {
						self.postMessage('{"command": "chunk collision", "data":{"position":[' + observer.prevPos[0] + ',' + observer.prevPos[1] + ',' + observer.prevPos[2] + '] }}');
					}
				}
			}

	}
	entities = buildings; // do collisions on buildings... just walls at first..
	i = entities.length - 1;

	while (i > -1) {
		obj = entities[i];
		distance = distance2d(position, obj.position);
		if (distance < 12000) {
			if (!obj.interiorLoaded) {
				obj.interiorLoaded = true;
				console.log("loadInterior...");
				self.postMessage('{"command":"load interior","data":' + JSON.stringify(obj) + '}');
			}

			if (!closeToVenue && distance < 8000) {
				closeToVenue = true;
				self.postMessage('{"command":"enter interior", "data":{"name":"'+obj.name+'"}}');
			}

			oPos = obj.position;
			if (position[0] > (oPos[0] - size) && position[0] < (oPos[0] + size)) { 		// now actually check collisions using box method...
				innerBox[0] = (position[0] > (oPos[0] - size + 600) && position[0] < (oPos[0] + size - 600));
				delta[0] = Math.abs(position[0] - oPos[0]);

				if (position[2] > (oPos[2] - size) && position[2] < (oPos[2] + size)) {
					innerBox[1] = (position[2] > (oPos[2] - size + 600) && position[2] < (oPos[2] + size - 600));
					delta[1] = Math.abs(position[2] - oPos[2]);

					if ((position[0] > oPos[0])) {
						position[0] = oPos[0] + size;
					} else {
						position[0] = oPos[0] - size;
					}
					if (position[2] > oPos[2]) {
						position[2] = oPos[2] + size;
					} else {
						position[2] = oPos[2] - size;
					}

					if (distance > size * 1.18) {

						self.postMessage('{"command": "building collision", "data":{"inner": '+((innerBox[0] == true && innerBox[1] == true) ? 1 : 0)+
						', "delta":[' + delta[0] + ',' + delta[1] + '], "position":[' + position[0] + ',' + position[1] + ',' + position[2] + '] }}');
						// "velocity": ['+velocity[0]+','+velocity[1]+','+velocity[2]+']

					}
				}
			}
		}

		i--;
	}
	self.postMessage('{"command": "update"}');
	self.updateLoop = setTimeout(function () {
		self.update();
	}, 33);
}

self.onmessage = function (event) { // Do some work.
	var data = JSON.parse(event.data),
			user = observer,
			c = 0,
			chunk = null,
			newChunks = [];

	if (data.command == "update") {
		user.coords = data.data.coords;
		user.prevPos = [user.position[0], user.position[1], user.position[2]];
		user.position = data.data.position;
		user.velocity = data.data.velocity;
		//self.postMessage(JSON.stringify(self.observer));
	} else if (data.command == "add object") {
		var cObject = new CollisionObject(data.data);
		objects.push(cObject);

	} else if (data.command == "add chunks") {
		newChunks = data.data;
		c = newChunks.length-1;
		while (c >= 0) {
			chunk = newChunks[c];
			chunks[chunk.coords[0]+"."+chunk.coords[1]+"."+chunk.coords[2]] = chunk;
			c--;
		}

	} else if (data.command == "remove chunks") {
		newChunks = data.data;
		c = newChunks.length-1;
		while (c >= 0) {
			chunk = newChunks[c];
			delete chunks[chunk.coords[0]+"."+chunk.coords[1]+"."+chunk.coords[2]];
			c--;
		}

	} else if (data.command == "add building") {
		var building = new CollisionBuilding(data.data);
		buildings.push(building);
		//		app.physicsWorker.postMessage('{"command":"addBuilding","data":{"name": "'+this.data.name+'", "structureType": "'+this.data.structureType+'", "size": "'+this.data.size+
		//								  '", "floors": '+this.data.floors+', "position":['+this.data.position[0]+','+this.data.position[1]+','+this.data.position[2]+']}}');
	} else if (data.command == "update object") {
		// implement
		self.unidentifiedObjects[0].id = data.data.id;
		self.unidentifiedObjects.splice(0, 1);

	} else if (data.command == "remove object") {
		for (var o = 0; o < self.objects.length; o++) {
			var co = self.objects[o];
			if (co.id == data.data.id && co.cellName == data.data.cellName) {
				self.objects.splice(o, 1);
			}
		}
	} else if (data.command == "clear") {
		objects = [];
		chunks = [];
		buildings = [];

	} else if (data.command == "start") {
		self.update();

	} else if (data.command == "stop") {
		self.stop();

	} else if (data.command == "log") {
		self.postMessage('{"command":"log","data":[' + user.position[0] + ',' + user.position[1] + ',' + user.position[2] + ']}');
		var allChunks = [];
		for (var key in chunks) {
			allChunks.push(chunks[key]);
		}
		self.postMessage('{"command":"log","data":' + JSON.stringify(allChunks)+'}');

	}
};

self.stop = function () {
	clearTimeout(self.updateLoop);
}
