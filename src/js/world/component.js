export default class Component {
  constructor (data) {
      var mesh = null,
          type = data.type;
          shape = data.shape,
          size = data.size,
          quaternion = data.quaternion ? data.quaternion : { x: 0, y: 0, z: 0, w: 0 },
          position = data.position ? data.position : { x: 0, y: 0, z: 0 },
          geomtry = null,
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
            geometry = new THREE.PlaneGeometry( size.x, size.y);
          break;
          case "box":
            geometry = new THREE.BoxGeometry( size.x, size.y, size.z);
          break;
          case "octahedron":
            geometry = new THREE.OctahedronGeometry( size.x, 0);
          case "sphere":
            geometry = new THREE.OctahedronGeometry( size.x, 3);
          break;
          case "cylinder":
            geometry = new THREE.CylinderGeometry( size.x, size.x, size.y, 14, 1);
          break;
          case "torus":
            geometry = new THREE.TorusBufferGeometry( size.x, 6.3, 5, 12 );
          break;
          case "hexagon":
            geometry = new THREE.CylinderGeometry(size.x, size.z, size.y, 6);
          break;
          case "text":
            geometry = new THREE.TextGeometry(data.text, data.text_params);
          break;
      }
      mesh = new THREE.Mesh(geometry , material);
      mesh.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
      mesh.position.set(position.x, position.y, position.z)
      this.data = data;
      this.type = type;
      this.mesh = mesh;
  }
}
