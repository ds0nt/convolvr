import Component from './component.js';

export default class Entity {
  constructor (id, components, position, quaternion, params = {}) {
      this.id = id;
      this.components = components;
      this.position = position;
      this.quaternion = quaternion;
  }

  init (scene) {
    var mesh = new THREE.Object3D(),
        ncomps = this.components.length,
        comp = null,
        c = 0;

    while (c < ncomps) {
        comp = new Component(this.components[c]);
        mesh.add(comp.mesh);
    }
    if (!! quaternion) {
        mesh.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    }
    mesh.position.set(position.x, position.y, position.z);
    scene.add(mesh);

    if (params.physics) {
        // send 'add collision entity' message to physics worker
    }
    if (params.audio) {
        // send 'add sound node' message to audio worker etc..
    }
  }

}
