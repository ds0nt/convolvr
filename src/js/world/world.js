import Avatar from './avatars/default.js';
import WorldPhysics from '../core/world-physics.js';

export default class World {
	constructor(socket, userInput) {
		var scene = new THREE.Scene(),
			camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 100, 1000000 ),
			renderer = new THREE.WebGLRenderer(),
			mobile = (window.innerWidth <= 640),
			self = this,
			coreGeom = new THREE.CylinderGeometry( 8096, 8096, 1024, 9),
			material = new THREE.MeshPhongMaterial( {color: 0xffffff} ),
			skyboxSideMat = new THREE.MeshBasicMaterial( {color:0x241631, fog: false} ),
			core = new THREE.Mesh(coreGeom, material),
			light = new THREE.PointLight(0xfcfcff, 1.5, 900000),
			panelMat = new THREE.MeshLambertMaterial({ color: 0xe1e1e1 }),
			cellGeometry = new THREE.CylinderGeometry(192, 192, 128, 6),
			skyShaderMat = null,
			cell = null,
			three = {},
			x = 0,
			y = 0,
			r = 4000;

		this.mode = "vr";
		this.user = {
			arms: [],
			velocity: new THREE.Vector3()
		}
		this.camera = camera;
		this.mobile = mobile;
		this.socket = socket;
		this.userInput = userInput;
		this.sendUpdatePacket = 0;
		this.capturing = false;
		this.webcamImage = "";

		scene.fog = new THREE.FogExp2(0x241631, 0.0000045);
		this.ambientLight = new THREE.AmbientLight(0x231344);
		scene.add(this.ambientLight);
		// light.position.set(0, 60000, -32000);
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );
		renderer.domElement.setAttribute("id", "viewport");
		renderer.setClearColor(0x241631);
		camera.position.set(-18391.370770019803, 5916.124890438994, -14620.440770421374);

		skyShaderMat = new THREE.ShaderMaterial( {
			side: 1,
			fog: false,
			uniforms: {
				time: { value: 1.0 }
			},
			vertexShader: document.getElementById('sky-vertex').textContent,
			fragmentShader: document.getElementById('sky-fragment').textContent

		} );

		this.ground = new THREE.Object3D();
		this.ground.rotation.x = -Math.PI /2;
		this.skybox = new THREE.Mesh(new THREE.OctahedronGeometry(750000, 4), skyShaderMat);
		this.skybox.add(light);
		scene.add(core);
		core.position.set(0, 2000, 0);
		light.position.set(0, 20000, 0);
		scene.add(this.skybox);
		this.skybox.position.set(camera.position.x, 0, camera.position.z);

		userInput.init(this, camera, this.user);
		this.worldPhysics = new WorldPhysics();
		this.worldPhysics.init(self);

		this.core = {
			physics: this.worldPhysics.worker,
			// audio: this.worldAudio.worker,
			// video: this.worldVideo.worker,
			// npc: this.npcLogic.worker
		}

		three = this.three = {
			world: this,
			skyMat: skyShaderMat,
			core: core,
			scene: scene,
			chunks: [],
			camera: camera,
			renderer: renderer
		};
		window.three = this.three;

		this.render(0);

		var configure = {
			baseURL: 'https://convolvr.io',
			timeout: 1000,
			headers: {'x-access-token': localStorage.getItem("token")}
		};

		window.onresize = function () {
			three.renderer.setSize(window.innerWidth, window.innerHeight);
			three.camera.aspect = innerWidth / innerHeight;
			three.camera.updateProjectionMatrix();
		}

	}

	render (last) {
		var sys = this,
			core = sys.three.core,
			mobile = sys.mobile,
			camera = sys.three.camera,
			delta = ((Date.now() - last) / 10000),
			time = (Date.now() / 4600),
			image = "",
			imageSize = [0, 0],
			userArms = sys.user.arms,
			arms = [];

		if (!! sys.userInput) {
			sys.userInput.update(delta);
		}
		if (sys.sendUpdatePacket == 30) { // send image
			if (sys.capturing) {
				var v = document.getElementById('webcam'),
				 	canvas = document.getElementById('webcam-canvas'),
				 	context = canvas.getContext('2d'),
				 	cw = Math.floor(v.videoWidth),
				 	ch = Math.floor(v.videoHeight),
					imageSize = [cw, ch];

				canvas.width = 512;
				canvas.height = 512;
				context.drawImage(v, 0, 0, 512, 512);
				sys.webcamImage = canvas.toDataURL("image/jpg", 0.5);
			}
			sys.sendUpdatePacket = 0;
		}

		sys.sendUpdatePacket += 1;
		if (sys.sendUpdatePacket %(2*(mobile ? 2 : 1)) == 0 && sys.mode == "vr") {

			if (sys.userInput.leapMotion) {
				userArms.forEach(function (arm) {
					arms.push({pos: [arm.position.x, arm.position.y, arm.position.z],
						quat: [arm.quaternion.x, arm.quaternion.y, arm.quaternion.z, arm.quaternion.w] });
					});
				}
				this.socket.emit('user update', {username:sys.username, image: sys.webcamImage, imageSize: imageSize, arms: arms, position: {x:camera.position.x, y:camera.position.y, z: camera.position.z},
				quaternion: {x: camera.quaternion.x, y: camera.quaternion.y, z: camera.quaternion.z, w:camera.quaternion.w}});
					if (sys.capturing) {
						sys.webcamImage = "";
					}

				}

				core.rotation.y += 0.005;
				sys.skybox.material.uniforms.time.value += delta;
				sys.skybox.position.set(camera.position.x, camera.position.y, camera.position.z);
				sys.ground.position.set(camera.position.x, camera.position.y - 2000, camera.position.z)
				sys.three.renderer.render(sys.three.scene, camera);
				last = Date.now();
				requestAnimationFrame( () => { this.render(last) } )
		}

	};
