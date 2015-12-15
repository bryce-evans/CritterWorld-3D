LemurWorldLookAndFeel = function() {
  WorldLookAndFeel.call(this);
  
  this.dir = "lemur/";
  
  this.scene_objs = ["ground", "water"];
  this.hex_colors.selected = 0xffbe10;  
  // graphics params
  // world.isVegetated = false;
  // world.hasFog = false;
  // world.hasWater = false;
  // world.hasTerrain = false;
//  world.map.skyColor = world.skies.black;
  this.fallback = new WireframeWorldLookAndFeel();
  this.fallback.load();
  
  this.hasTerrain = true;
  this.hasFog = true;
  this.hasWater = true;
}
LemurWorldLookAndFeel.prototype = Object.create(WorldLookAndFeel.prototype);
LemurWorldLookAndFeel.prototype.constructor = LemurWorldLookAndFeel;

// all hexes same color
LemurWorldLookAndFeel.prototype.getHexWire = function(xy_pos, radius, buffer) {
  return WorldLookAndFeel.prototype.getHexWire(xy_pos, 0x8bf600, radius, buffer);
}

LemurWorldLookAndFeel.prototype.getCritter = function(species, subtype) {
  return this.fallback.getCritter(species, subtype);
  
}
LemurWorldLookAndFeel.prototype.getEnergy = function(size) {
  return this.fallback.getEnergy(size);
}

LemurWorldLookAndFeel.prototype.addSceneModels = function(scene, size) {
  size = 100;
  // Add terrain (from Terrain.js)
  if (this.hasTerrain) {
    var terrain = new Terrain();
    var map = world.map;
    terrain.updateTerrain(size.x, size.y, terrain.segments, 3);

    terrain.setTexture(terrain.texture);

//    terrain.mesh.position.copy(new THREE.Vector3(map.center.x, -1, map.center.y));

    scene.add(terrain.mesh);
  }
  if (this.hasFog) {
    var fog = new THREE.Fog(0xffffff, 10, Math.max(Math.max(world.COLUMNS, world.ROWS) * 12, 300));
  }
  // Add water (from Water.js)
  if (this.hasWater) {
    water = new Water();
    water.addWater(scene);
  }




}
