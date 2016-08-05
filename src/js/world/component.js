export default class Component {
  constructor (data) {
      var mesh = null,
          type = data.type;
          shape = data.shape,
          size = data.size,
          rotation = data.rotation ? data.rotation : { x: 0, y: 0, z: 0, w: 0 },
          position = data.position ? data.position : { x: 0, y: 0, z: 0 },
          material = new THREE.MeshBasicMaterial({ // temporary material..
              color: data.color || 0xffffff,
              wireframe: true,
              fog: false
          });

      switch (shape) {
          case "node":
            mesh = new THREE.Object3D();
          break;
          case "plane":
            mesh = new THREE.Mesh(new THREE.PlaneGeometry( size.x, size.y) , material);
          break;
          case "box":
            mesh = new THREE.Mesh(new THREE.BoxGeometry( size.x, size.y, size.z) , material);
          return;
          case "octahedron":
            mesh = new THREE.Mesh(new THREE.OctahedronGeometry( size.x, 0), material);
          case "sphere":
            mesh = new THREE.Mesh(new THREE.OctahedronGeometry( size.x, 3), material);
          return;
          case "cylinder":
            mesh = new THREE.Mesh(new THREE.CylinderGeometry( size.x, size.x, size.y, 14, 1), material);
          return;
          case "torus":
            mesh = new THREE.Mesh(new THREE.TorusBufferGeometry( size.x, 6.3, 5, 12 ), material);
          case "text":
            mesh = new THREE.Mesh(new THREE.TextGeometry(data.text, data.text_params), material);
          return;
      }

      mesh..quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
      mesh.position.set(position.x, position.y, position.z)
      this.data = data;
      this.type = type;
      this.mesh = mesh;
  }
}
