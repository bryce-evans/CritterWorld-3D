if (!Detector.webgl)
  Detector.addGetWebGLMessage();

init();

function init() {

  // Grid

  world.addAxes();

  var geometry = new THREE.Geometry();
  var material = new THREE.LineBasicMaterial({
    color : 0x00ffff
  });

  for (var c = 0; c != world.COLUMNS + 1; c++) {
    for (var r = Math.ceil(c / 2); 2 * r <= c + (2 * world.ROWS - world.COLUMNS) + (world.COLUMNS % 2 == 0 && c % 2 != 0 ? 1 : 0); r++) {
     new Hex(c, r);
    }
  }

  // Lights

  world.scene.add(new THREE.AmbientLight(0xcccccc));

  spotLight = new THREE.SpotLight(0xaaaaaa);
  spotLight.position.set(1000, 500, 1000);
  spotLight.castShadow = true;
  spotLight.shadowCameraNear = 500;
  spotLight.shadowCameraFov = 70;
  spotLight.shadowBias = 0.001;
  spotLight.shadowMapWidth = 1024;
  spotLight.shadowMapHeight = 1024;
  world.scene.add(spotLight);

  var skyGeometry = new THREE.CubeGeometry(1500, 1500, 1500);

  var sky_path = "/CritterWorld/rsc/textures/sky2_ENV/cloudy_";
  var directions = ["xp", "xn", "yp", "yn", "zp", "zn"];
  var extension = ".png";

  var materialArray = [];
  for (var i = 0; i < 6; i++)
    materialArray.push(new THREE.MeshBasicMaterial({
      map : THREE.ImageUtils.loadTexture(sky_path + directions[i] + extension),
      side : THREE.BackSide,
      // fog: new THREE.fog(0xffffff,1000,1600)
    }));
  var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
  var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
  // world.scene.add(skyBox);

  // INSERT PLANE HERE

  world.renderer = new THREE.WebGLRenderer();
  world.renderer.setSize(window.innerWidth, window.innerHeight);
  world.renderer.setClearColor(0xade0f4, 0.6)

  world.container.appendChild(world.renderer.domElement);

  world.stats = new Stats();
  world.stats.domElement.style.position = 'absolute';
  world.stats.domElement.style.top = '0px';
  world.container.appendChild(world.stats.domElement);

  //

  window.addEventListener('resize', onWindowResize, false);
  controls = new THREE.OrbitControls(world.camera, world.renderer.domElement);

  /*
   * Run the animation loop
   */
  animate()

}

function onWindowResize() {

  world.camera.aspect = window.innerWidth / window.innerHeight;
  world.camera.updateProjectionMatrix();

  world.renderer.setSize(window.innerWidth, window.innerHeight);

  world.SCREEN_WIDTH = window.innerWidth;
  world.SCREEN_HEIGHT = window.innerHeight;

}

//

function animate() {

  world.frameDelta = world.clock.getDelta();

  requestAnimationFrame(animate);


	// update all animated objects
  var l = world.scene.map.animations.length;
  for (var i = 0; i < l; i++) {
    world.scene.map.animations[i].update(world.frameDelta * 1.2);
  }

  render();
  world.stats.update();

}

function render() {

  world.renderer.render(world.scene, world.camera);
  controls.update();
}