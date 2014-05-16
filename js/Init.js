function init_game_server(data) {
  // add world and create map (from World, Map. js)
  world = new World();
  world.map = new Map(world);
  world.map.calculateSize();

  // graphics params
  world.isVegetated = false;
  world.hasFog = false;
  world.hasWater = false;
  world.hasTerrain = false;
  world.map.skyColor = world.skies.black;

  // Add terrain (from Terrain.js)
  if (world.hasTerrain) {
    var terrain = new Terrain();
    var map = world.map;
    terrain.updateTerrain(map.size.x, map.size.y, terrain.segments, 3);

    world.scene.terrain = terrain;
    terrain.setTexture(terrain.texture);

    terrain.mesh.position = new THREE.Vector3(map.center.x, -1, map.center.y);

    world.scene.add(terrain.mesh);
  }
  if (world.hasFog) {
    world.scene.fog = new THREE.Fog(0xffffff, 10, Math.max(Math.max(world.COLUMNS, world.ROWS) * 12, 300));
  }
  // Add water (from Water.js)
  if (world.hasWater) {
    water = new Water(world.map);
    water.addWater(world.scene);
  }

  // Add mouse controls (from MouseControls.js)
  THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);

  // Add controls for side pane (from CritterControls.js)
  world.critterControls = new CritterControls(world);

  if (!Detector.webgl)
    Detector.addGetWebGLMessage();
  console.log(data);

  // add Hex Grid to World
  for (var c = 0; c != world.COLUMNS + 1; c++) {
    for (var r = Math.ceil(c / 2); 2 * r <= c + (2 * world.ROWS - world.COLUMNS) + (world.COLUMNS % 2 == 0 && c % 2 != 0 ? 1 : 0); r++) {
      new Hex(c, r);
    }
  }

  world.map.addToMap(data.state);
  init();
}