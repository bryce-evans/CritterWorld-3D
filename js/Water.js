/**
 *
 * @param {XYPoint} size
 */
Water = function(map) {
	this.map = map;

}
Water.prototype = {
  addWater : function(scene) {
    var geometry = new THREE.PlaneGeometry(this.map.size.x*2, this.map.size.y*2);
    var material = new THREE.MeshBasicMaterial({
      color : 0x0000ff
    });
    var plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI/2;
    plane.position = new THREE.Vector3(this.map.center.x,-2,this.map.center.y);
    scene.add(plane);
  }
}

water = new Water(world.scene.map);
water.addWater(world.scene);


