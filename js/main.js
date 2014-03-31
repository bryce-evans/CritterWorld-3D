if (!Detector.webgl)
  Detector.addGetWebGLMessage();

init();

function init() {

  document.body.appendChild(world.container);

  lookAt = new THREE.Vector3(3,-3,3);

  // Grid

  world.addAxes();
  // var size = 14, step = 1;

  var geometry = new THREE.Geometry();
  var material = new THREE.LineBasicMaterial({
    color : 0x00ffff
  });

  // for (var i = -size; i <= size; i += step) {
  //
  // geometry.vertices.push(new THREE.Vector3(-size, -0.04, i));
  // geometry.vertices.push(new THREE.Vector3(size, -0.04, i));
  //
  // geometry.vertices.push(new THREE.Vector3(i, -0.04, -size));
  // geometry.vertices.push(new THREE.Vector3(i, -0.04, size));
  //
  // }

  /*
   for (var i = 0; i <= 6; i++) {
   xPoint = (1 * Math.cos(i * 2 * Math.PI / 6));
   yPoint = (1 * Math.sin(i * 2 * Math.PI / 6));
   geometry.vertices.push(new THREE.Vector3(xPoint,0, yPoint));
   }

   var line = new THREE.Line(geometry, material);
   world.scene.add(line);

   */

  for (var c = 0; c != world.COLUMNS + 1; c++){
    for (var r = Math.ceil(c / 2); 2 * r <= c + (2 * world.ROWS - world.COLUMNS) + (world.COLUMNS % 2 == 0 && c % 2 != 0 ? 1 : 0); r++) {
      world.scene.map.hexes.push(new Hex(c, r));
    }
}



// Lights

world.scene.add(new THREE.AmbientLight(0xcccccc));

var directionalLight = new THREE.DirectionalLight(/*Math.random() * 0xffffff*/0xeeeeee);
directionalLight.position.x = Math.random() - 0.5;
directionalLight.position.y = Math.random() - 0.5;
directionalLight.position.z = Math.random() - 0.5;
directionalLight.position.normalize();
world.scene.add(directionalLight);

world.renderer = new THREE.WebGLRenderer();
world.renderer.setSize(window.innerWidth, window.innerHeight);
world.renderer.setClearColor(0x111111, 0.6)

world.container.appendChild(world.renderer.domElement);

world.stats = new Stats();
world.stats.domElement.style.position = 'absolute';
world.stats.domElement.style.top = '0px';
world.container.appendChild(world.stats.domElement);

//

window.addEventListener('resize', onWindowResize, false);
 controls = new THREE.OrbitControls(world.camera, world.renderer.domElement);
 
/* *************************************************************
* Here we are adding the skinned mesh to the scene
*
* It is required for the animation name to be recognisable to
* add animation data from the geometry to THREE.AnimationHandler
* (currently this is the only way i found animations possible)
* and probably this is the most efficient way to deal with animations
**************************************************************/
// scene.add(critter);
// THREE.AnimationHandler.add(critter.geometry.animations[0]);
// animation_wing_right = new THREE.Animation(wing_right, "WingFlap", THREE.AnimationHandler.CATMULLROM)
// animation_wing_right.play();

/*
 * Run the animation loop
 */
animate()

}

function onWindowResize() {

  world.camera.aspect = window.innerWidth / window.innerHeight;
  world.camera.updateProjectionMatrix();

  world.renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function animate() {

  /*
  * Here the mesh animation is updated
  * the argument for update method should be delta time since
  * last frame in miliseconds
  * for simplicity I've sent 0.01 miliseconds value what
  * should display the animation
  */

  //  renderer.render( scene, camera );

  /////////////////////

  var delta = world.clock.getDelta();

  requestAnimationFrame(animate);

  //animation_wing_left.update(delta * .9);
  //animation_wing_right.update(delta * .9);

  //if (t > 1)
  // t = 0;

  /* if (skin) {

   // guess this can be done smarter...

   // (Indeed, there are way more frames than needed and interpolation is not used at all
   //  could be something like - one morph per each skinning pose keyframe, or even less,
   //  animation could be resampled, morphing interpolation handles sparse keyframes quite well.
   //  Simple animation cycles like this look ok with 10-15 frames instead of 100 ;)

   for (var i = 0; i < skin.morphTargetInfluences.length; i++) {

   skin.morphTargetInfluences[i] = 0;

   }

   skin.morphTargetInfluences[ Math.floor(t * 30)] = 1;

   t += delta;

   }
   */
  render();
  world.stats.update();

}

function render() {

  var timer = Date.now() * 0.0005;

  // world.camera.position.x = Math.cos(timer) * 15;
  // world.camera.position.y = 10;
  // world.camera.position.z = Math.sin(timer) * 15;
// 
  // world.camera.lookAt(new THREE.Vector3(0, 0, 0));
// 
  // particleLight.position.x = Math.sin(timer * 4) * 3009;
  // particleLight.position.y = Math.cos(timer * 5) * 4000;
  // particleLight.position.z = Math.cos(timer * 4) * 3009;

  world.renderer.render(world.scene, world.camera);
  controls.update();

}