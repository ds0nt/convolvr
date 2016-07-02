/* default avatar */
export default class Avatar {
    constructor (name, type, data) {
        var mesh = new THREE.Object3D();
        // implement
        this.type = type;
        this.data = data;
        this.mesh = mesh;
    }
}
