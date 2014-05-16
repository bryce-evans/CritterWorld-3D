/**
 *
 * @param {XYPoint} size
 */
Water = function(map) {
  this.map = map;
  this.uniforms = null;

  // TODO not animated yet
  // map.animations.push(this);

}
Water.prototype = {
  addWater : function(scene) {

    var geometry = new THREE.PlaneGeometry(this.map.size.x * 2, this.map.size.y * 2);

    var path = "rsc/textures/sky_ENV/surreal_";
    var format = '.jpg';
    var urls = [path + 'px' + format, path + 'nx' + format, path + 'py' + format, path + 'ny' + format, path + 'pz' + format, path + 'nz' + format];
    var reflectionCube = THREE.ImageUtils.loadTextureCube(urls);

    /////////////////////////////////////////////////

    var bmp = THREE.ImageUtils.loadTexture("cloud.png");
    var dif = THREE.ImageUtils.loadTexture("water_DIF.jpg");
    var nrm1 = THREE.ImageUtils.loadTexture("water_NRM.png");
    var nrm2 = THREE.ImageUtils.loadTexture("water2_NRM.jpg");

    this.uniforms = {
      color : 0x00ead7,
      specular : 0xffffff,
      ambient : 0x00887d,
      shininess : 8,
      normalMap : nrm1,

      envMap : reflectionCube,
      // nrm1speed : 0.1,
//  
      // reflectivity : 0.1,
      // fogDensity : {
        // type : "f",
        // value : 0.45
      // },
      // fogColor : {
        // type : "v3",
        // value : new THREE.Vector3(0, 0, 0)
      // },
      // time : {
        // type : "f",
        // value : 1.0
      // },
      // resolution : {
        // type : "v2",
        // value : new THREE.Vector2()
      // },
      // uvScale : {
        // type : "v2",
        // value : new THREE.Vector2(3.0, 1.0)
      // },
      // texture_DIF : {
        // type : "t",
        // value : dif
      // },
      // texture_NRM : {
        // type : "t",
        // value : dif
      // },
      // texture_NRM2 : {
        // type : "t",
        // value : dif
      // }

    };

    //this.uniforms.normalMap.wrapS = this.uniforms.normalMap.wrapT = THREE.RepeatWrapping;
    //this.uniforms.normalMap.value.wrapS = this.uniforms.normalMap.value.wrapT = THREE.RepeatWrapping;

    var size = 0.65;

    // material = new THREE.ShaderMaterial({
// 
      // uniforms : this.uniforms,
      // vertexShader : document.getElementById('vertexShader').textContent,
      // fragmentShader : document.getElementById('fragmentShader').textContent
// 
    // });
    
    material = new THREE.MeshPhongMaterial(this.uniforms);
    //////////////////////////////////

    
    var plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.position = new THREE.Vector3(this.map.center.x, -2, this.map.center.y);

    scene.add(plane);
  }
}

