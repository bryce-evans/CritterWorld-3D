/**
 *
 * @param {XYPoint} size
 */
Water = function(map) {
  this.map = map;

}
Water.prototype = {
  addWater : function(scene) {

    var geometry = new THREE.PlaneGeometry(this.map.size.x * 2, this.map.size.y * 2);

    var path = "rsc/textures/sky_ENV/surreal_";
    var format = '.jpg';
    var urls = [path + 'px' + format, path + 'nx' + format, path + 'py' + format, path + 'ny' + format, path + 'pz' + format, path + 'nz' + format];
    var reflectionCube = THREE.ImageUtils.loadTextureCube(urls);


    var material = new THREE.MeshPhongMaterial({
      color : 0x00ead7,
      specular : 0xffffff,
      ambient : 0x00887d,
      shininess : 8,
      normalMap : THREE.ImageUtils.loadTexture("rsc/textures/water_NRM.png"),

      envMap : reflectionCube,
      //combine : THREE.MixOperation,
      reflectivity : 1
    });
    var plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.position = new THREE.Vector3(this.map.center.x, -2, this.map.center.y);
    scene.add(plane);
  }
}

water = new Water(world.scene.map);
water.addWater(world.scene);

