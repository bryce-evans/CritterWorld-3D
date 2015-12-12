WireframeWorldLookAndFeel = function() {
  WorldLookAndFeel.call(this);
  
  this.dir = undefined;
  
  this.scene_objs = [];
  this.hex_colors.selected = 0x8d00e7;  

}
WireframeWorldLookAndFeel.prototype = Object.create(WorldLookAndFeel.prototype);
WireframeWorldLookAndFeel.prototype.constructor = WireframeWorldLookAndFeel;



WireframeWorldLookAndFeel.prototype.load = function() {
// nothing to load
}

// all hexes same color
WireframeWorldLookAndFeel.prototype.getHexWire = function(xy_pos, radius, buffer) {
  var c = new THREE.Color();
  c.setHSL(Math.random(), 1, 0.5);
  var hex = c.getHex();
  return WorldLookAndFeel.prototype.getHexWire(xy_pos, hex, radius, buffer);
}

WireframeWorldLookAndFeel.prototype.getDecorations = function() {
  return [];
}
WireframeWorldLookAndFeel.prototype.getCritter = function() {
  var geometry = new THREE.SphereGeometry(1.5,1.5,1.5);
  var material = new THREE.MeshBasicMaterial({wireframe:true, color : 0x00ff00});
  return new THREE.Mesh(geometry, material);
}
WireframeWorldLookAndFeel.prototype.getRock = function() {
  var geometry = new THREE.BoxGeometry(1.5,1.5,1.5);
  var material = new THREE.MeshBasicMaterial({wireframe:true, color : 0xff0000});
  return new THREE.Mesh(geometry, material);
}

WireframeWorldLookAndFeel.prototype.getScene = function() {
  return [];
}
