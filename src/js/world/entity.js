import Component from './component.js';

export default class Entity {
  constructor (id, components) {
      this.id = id;
      this.components = components;
  }

  init (scene, opts) {
    var entityMesh = new THREE.Object3D(),
        ncomps = this.components.length,
        comp = null,
        c = 0;

    while (c < ncomps) {
        comp = new Component(this.components[c]);
        entityMesh.add(comp.mesh);
    }
    scene.add(entityMesh);
  }

  explode (opts) {

  }
}
