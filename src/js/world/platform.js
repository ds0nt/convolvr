export default class Platform {
  constructor (data) {
      var mesh = null,
          geom = new THREE.CylinderGeometry( 128000, 128000, 2048, 6),
          mat = new THREE.MeshPhongMaterial( {color: 0x151025, shininess: 40} ),
          mesh = new THREE.Mesh(geom, mat);

      three.scene.add(mesh);

      if (!!data && !!data.position) {
          mesh.position.set(data.position.x, data.position.y, data.position.z);
      } else {
          if (!data) {
              data = {
                  position: {
                      x: mesh.position.x,
                      y: mesh.position.y,
                      z: mesh.position.z
                  },
                  size: {
                      x: 128000,
                      y: 128000,
                      z: 2048
                  }
              }
          }
          mesh.position.set(0, -4000, 0);
      }

      this.data = data;
      this.mesh = mesh;
  }
}
