function init_game_server() {
  // add world and create map (from World, Map. js)
  world = new World();
  world.map = new Map(world);
  world.map.calculateSize();

  // Add terrain (from Terrain.js)
  var terrain = new Terrain();
  var map = world.map;
  terrain.updateTerrain(map.size.x, map.size.y, terrain.segments, 3);

  world.scene.terrain = terrain;
  terrain.setTexture(terrain.texture);
  terrain.setFog(terrain.fog);

  terrain.mesh.position = new THREE.Vector3(map.center.x, -1, map.center.y);

  world.scene.add(terrain.mesh);

  // Add water (from Water.js)
  water = new Water(world.map);
  water.addWater(world.scene);

  // Add mouse controls (from MouseControls.js)
  THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);

  // Add controls for side pane (from CritterControls.js)
  world.critterControls = new CritterControls(world);

  if (!Detector.webgl)
    Detector.addGetWebGLMessage();

  init();
}