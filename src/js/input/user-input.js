export default class UserInput {
	constructor () {
		 return {
			camera: null,
			avatar: null,
			focus: false,
			fullscreen: false,
			rotationVector: {
				x: 0,
				y: 0,
				z: 0
			},
			tmpQuaternion: null,
			moveVector: null,
			keys: {
				w: false, a: false, s: false, d: false, r: false, f: false, shift: false, space: false
			},
			lastTouch: [[0,0], [0,0]],
			leapMotion: false,
			leapMode: "hybrid",
			init: function (camera, avatar) {
				var uInput = this;
				this.connect(camera, avatar);
				uInput.rotationVector = {x: 0.2, y: 5.65, z: 0};
				var canvas = document.querySelector("canvas#viewport");
				canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
				canvas.onclick = function (event) {
					var elem = event.target;
					if (app.mode == "vr") {
						elem.requestPointerLock();
						uInput.toggleFullscreen();
					}
				};
				if ("onpointerlockchange" in document) {
					document.addEventListener('pointerlockchange', lockChangeAlert, false);
				} else if ("onmozpointerlockchange" in document) {
					document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
				} else if ("onwebkitpointerlockchange" in document) {
					document.addEventListener('webkitpointerlockchange', lockChangeAlert, false);
				}
				function lockChangeAlert() {
					var a = 0;
					uInput.focus =(document.pointerLockElement===canvas||document.mozPointerLockElement===canvas||document.webkitPointerLockElement===canvas);
					uInput.fullscreen = uInput.focus;
					if (!uInput.fullscreen && app.username != "") {
						app.showChat();
						app.mode = "desktop";
						while (a < app.user.arms.length) {
							app.user.arms[a].visible = false;
							a ++;
						}
						document.body.setAttribute("class", "desktop");
					} else {
						if (app.username != "") {
							app.mode = "vr";
							while (a < app.user.arms.length) {
								app.user.arms[a].visible = true;
								a ++;
							}
							document.body.setAttribute("class", "vr");
						}
					}
				}
				if (!app.mobile) {
					document.addEventListener("mousemove", function (e) {
						if (uInput.focus) {
						  uInput.rotationVector.y  -=(e.movementX || e.mozMovementX || e.webkitMovementX || 0) / 300.0;
						  uInput.rotationVector.x  -=(e.movementY || e.mozMovementY || e.webkitMovementY || 0) / 300.0;
						}
					});
				}
				document.addEventListener("keydown", function (event) {
					if (app.mode == "vr") { // 0 = chat, 1 = vr
						switch (event.keyCode) {
							case 87: uInput.keys.w = true; break;
							case 65: uInput.keys.a = true; break;
							case 83: uInput.keys.s = true; break;
							case 68: uInput.keys.d = true; break;
							case 82: uInput.keys.r = true; break;
							case 70: uInput.keys.f = true; break;
							case 16: uInput.keys.shift = true; break;
							case 32: uInput.keys.space = true; break;
							case 27: // escape key
								if (app.username != "") {
									app.showChat();
									app.mode = "desktop";
									document.body.setAttribute("class", "desktop");
									//document.querySelector("#chatMode").click();
								}
							break;
						}
					}
				}, true);
				document.addEventListener("keyup", function (event) {
					switch (event.keyCode) {
						case 87: uInput.keys.w = false; break;
						case 65: uInput.keys.a = false; break;
						case 83: uInput.keys.s = false; break;
						case 68: uInput.keys.d = false; break;
						case 82: uInput.keys.r = false; break;
						case 70: uInput.keys.f = false; break;
						case 16: uInput.keys.shift = false; break;
						case 32: uInput.keys.space = false; break;
					}
				}, true);
				document.body.addEventListener("touchmove", function(event) {
					var data = event.touches, touch = data.length;
					if (app.mode == "vr") {
						event.preventDefault();
						if (touch < 2) {
							uInput.rotationVector.y += (data[0].pageX - uInput.lastTouch[0][0]) / 500.0;
							uInput.rotationVector.x += (data[0].pageY - uInput.lastTouch[0][1]) / 500.0;
							uInput.lastTouch = [ [data[0].pageX, data[0].pageY], [data[0].pageX, data[0].pageY]];
						} else {
							while (touch-- > 0) {
								uInput.moveVector.x -= (data[touch].pageX - uInput.lastTouch[touch][0])*180;
								uInput.moveVector.z -= (data[touch].pageY - uInput.lastTouch[touch][1])*180;
								uInput.lastTouch[touch] = [data[touch].pageX, data[touch].pageY];
							}
						}
					}
				});
				document.body.addEventListener("touchstart", function(event) {
					var data = event.touches, touch = data.length ;
					//uInput.lastTouch = [[0,0],[0,0]];
					if (app.mode == "vr") {
						event.preventDefault();
						while (touch-- > 0) {
							uInput.lastTouch[touch] = [data[touch].pageX, data[touch].pageY];
						}
					}
				});


				// leap code here
				Leap.loop(function (frame) {
				  var mode = app.mode,
					  input = uInput,
                      user = app.user;
					uInput.leapMotion = true;
                    if (mode == "vr") { // if its VR mode and not chat mode
                        if (input.leapMode == "movement") {
                            frame.hands.forEach(function (hand, index) {
                                var position = hand.screenPosition();
                                input.moveVector.x = ((-window.innerWidth / 2) + position[0]);
                                input.moveVector.z = ((-window.innerWidth / 2) + position[2]);
                                input.rotationVector.y -= 0.025 * hand.yaw(); //((-window.innerWidth / 2) + position[0]) / 3000;
                                input.rotationVector.x += 0.015 * hand.pitch();
                            });
                        } else {
                            if (input.leapMode == "avatar") {
                                frame.hands.forEach(function (hand, index) {
                                    var position = hand.screenPosition();
                                    user.arms[index].visible = true;
                                    user.arms[index].rotation.set(hand.pitch(), -hand.yaw(), 0);
                                    user.arms[index].position.set(-50+((-window.innerWidth / 2) + position[0]), 0, -350 + position[2]);
                                    user.arms[index].updateMatrix();
                                });
                            } else {
                                frame.hands.forEach(function (hand, index) {
                                    var position = hand.screenPosition(),
                                        handIndex = 0;
                                        if (index == 0) { // if its the first hand, control the camera
                                            input.moveVector.x = ((-window.innerWidth / 2) + position[0]);
                                            input.moveVector.z = ((-window.innerWidth / 2) + position[2]);
                                            input.rotationVector.y -= 0.025 * hand.yaw(); //((-window.innerWidth / 2) + position[0]) / 3000;
                                            input.rotationVector.x += 0.015 * hand.pitch();
                                        } else { // if its the second hand, control the arms/hands
                                            while (handIndex < 2) {
                                                user.arms[handIndex].visible = true;
                                                user.arms[handIndex].rotation.set(hand.pitch(), -hand.yaw(), 0);
                                                user.arms[handIndex].position.set(-50+((300*handIndex)+((-window.innerWidth / 2) + position[0])), 0, -350 + position[2]);
                                                user.arms[handIndex].updateMatrix();
                                                handIndex ++;
                                            }
                                        }
                                });
                            }
                        }
					}
					// define more leapModes here...
				}).use('screenPosition', {scale: 0.15});

				this.tmpQuaternion = new THREE.Quaternion();
				this.moveVector = new THREE.Vector3(0, 0, 0);
			},
			connect: function (camera, avatar) {
				this.camera = camera;
				this.avatar = avatar;
				avatar.userInput = this;
			},
			update: function (delta) {
				var bottom = 0,
          	velocity = this.avatar.velocity; //world.getElevation(this.camera.position);

                if (app.mode == "vr") {
					this.handleKeys();
					if (this.avatar.gravity > 0.25 ) {
						velocity.y -= 320 * this.avatar.gravity;
					}
				}

				this.camera.rotation.set(this.rotationVector.x, this.rotationVector.y, 0, "YXZ");
				velocity.add(this.moveVector.applyQuaternion(this.camera.quaternion));

				if (this.leapMotion && this.moveVector.length() > 0) {
					if (velocity.y < 0) {
						velocity.y *= 0.95;
					}
				}
				this.moveVector.set(0, 0, 0);
				if (this.camera.position.y < bottom + 500) {
					if (this.keys.shift) {
						velocity.y *= -0.70;
					} else {
						velocity.y *= -0.20;
					}
					this.avatar.falling = false;
					this.camera.position.y = bottom + 500;
					if (velocity.y > 1000) {
						app.vibrate(50);
					}
				}
				this.camera.matrix.setPosition(this.camera.position.add(new THREE.Vector3(velocity.x*delta, velocity.y*delta, velocity.z*delta)) );
				this.camera.matrix.makeRotationFromQuaternion(this.camera.quaternion );
				this.camera.matrixWorldNeedsUpdate = true;
				velocity.x *= 0.98;
				velocity.z *= 0.98;
				if (!! app.user.mesh) {
					 app.user.mesh.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
					app.user.mesh.rotation.y = (this.camera.rotation.y);
				}
			},
			handleKeys: function () {
                var velocity = this.avatar.velocity;
				if (this.keys.a) {  // maybe insert more options here...
					this.moveVector.x = -1200;
				} else if (this.keys.d) {
					this.moveVector.x = 1200;
				}
				if (this.keys.w) {
					this.moveVector.z = -1200;
				} else if (this.keys.s) {
					this.moveVector.z = 1200;
				}
				if (this.keys.r) {
					this.moveVector.y = 1200;
				} else if (this.keys.f) {
					this.moveVector.y = -1200;
				}
				if (this.keys.shift) {
					velocity.x *= 1.02;
					velocity.z *= 1.02;
				}
				if (this.keys.space && !this.avatar.falling) {
					this.avatar.falling = true;
					velocity.y = 16000;
				}
			},
			toggleFullscreen: function (elem) {
				if (!document.fullscreenElement &&
					  !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
					this.fullscreen = true;
					if (document.documentElement.requestFullscreen) {
						document.documentElement.requestFullscreen();
					} else if (document.documentElement.msRequestFullscreen) {
						document.documentElement.msRequestFullscreen();
					} else if (document.documentElement.mozRequestFullScreen) {
						document.documentElement.mozRequestFullScreen();
					} else if (document.documentElement.webkitRequestFullscreen) {
						document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
					}
				} else {
					 this.fullscreen = false;
					if (document.exitFullscreen) {
						document.exitFullscreen();
					} else if (document.msExitFullscreen) {
						document.msExitFullscreen();
					} else if (document.mozCancelFullScreen) {
						document.mozCancelFullScreen();
					} else if (document.webkitExitFullscreen) {
						document.webkitExitFullscreen();
					}
				}
    },
		};
	}
};
