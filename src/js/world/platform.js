export default class Platform {
  constructor (data) {
      var mesh = null,
          geom = new THREE.CylinderGeometry( 128000, 128000, 2048, 6),
          mat = new THREE.MeshPhongMaterial( {color: 0xffffff} ),
          mesh = new THREE.Mesh(geom, mat);

      three.scene.add(mesh);

      if (!!data && !!data.position) {
          mesh.position.set(data.position.x, data.position.y, data.position.z);
      } else {
          mesh.position.set(0, -4000, 0);
      }

      this.data = data;
      this.mesh = mesh;
  }
}
