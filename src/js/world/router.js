export default class Router {
  constructor (inputs, outputs) {
      var mesh = new THREE.Object3D();

      this.inputs = inputs;
      this.outputs = outputs;
      this.mesh = mesh;
  }
}
