WireframeWorldLookAndFeel = function() {
  WorldLookAndFeel.call(this);
  
  this.dir = undefined;
  
  this.scene_objs = [];
  this.hex_colors.selected = 0xff5da9;  

}
WireframeWorldLookAndFeel.prototype = Object.create(WorldLookAndFeel.prototype);
WireframeWorldLookAndFeel.prototype.constructor = WireframeWorldLookAndFeel;

WireframeWorldLookAndFeel.prototype.load = function() {
  var models = this.models = {};
  var critters = models.critter = [];
  critters[0] = {};
  critters[0].geometry = new THREE.IcosahedronGeometry(1, 0 );
  critters[0].material = new THREE.MeshBasicMaterial({wireframe:true, color : 0x00ff00});
  var rock = models.rock = []; 
  rock[0] = {};
  rock[0].geometry = new THREE.CylinderGeometry(0, 1, 2, 6, 1, true);
  rock[0].material = new THREE.MeshBasicMaterial({wireframe:true, color : 0xff0000});
  
  var energy = models.energy = [];
  energy[0] = {};
  energy[0].geometry = new THREE.BoxGeometry(1.25,1.25,1.25); 
  energy[0].material = new THREE.MeshBasicMaterial({wireframe:true, color : 0x00ffff});
}

// all hexes same color
WireframeWorldLookAndFeel.prototype.getHexWire = function(xy_pos, radius, buffer) {
  var c = new THREE.Color();
  c.setHSL(Math.random() * 0.1 + 0.70, 1, 0.2);
  var hex = c.getHex();


  var mesh = WorldLookAndFeel.prototype.getHexWire(xy_pos, hex, radius, buffer);
  return mesh;

  ////////////////////////////////// 
  var material = new THREE.LineBasicMaterial({color: c});
    var xyPoint = xy_pos;

    var xoffset = (xyPoint.x * radius) * 1.5;
    var yoffset = xyPoint.y * radius * Math.sqrt(3) - buffer / 2;

  var group = new THREE.Object3D();
    for (var i = 0; i < 6; i+=2) {
      var geometry = new THREE.Geometry();
    for (var j = 0; j < 2; j++) {

      var pos = i + j; 
      var xPoint = (xoffset + (radius-buffer-.25) * Math.cos(pos * 2 * Math.PI / 6));
      var yPoint = (yoffset + (radius-buffer-.25) * Math.sin(pos * 2 * Math.PI / 6));
      geometry.vertices.push(new THREE.Vector3(yPoint, 0.04, xPoint));
    }
      var wire = new THREE.Line(geometry, material);
      group.add(wire);
    }

    group.origColor = hex;
    return group;
 }

WireframeWorldLookAndFeel.prototype.getDecorations = function() {
  return [];
}
WireframeWorldLookAndFeel.prototype.getCritter = function(species, subtype) {
  species = 0;
  var geometry = this.models.critter[species].geometry;
  var material = this.models.critter[species].material;
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.y += 1;
  return mesh;
}
WireframeWorldLookAndFeel.prototype.getRock = function(size) {
  size = 1;
  var geometry = this.models.rock[0].geometry;
  var material = this.models.rock[0].material;
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.y += 1;
  return mesh;
}

WireframeWorldLookAndFeel.prototype.getEnergy = function(size) {
  size = 1;
  var geometry = this.models.energy[0].geometry;
  var material = this.models.energy[0].material;
  var mesh =  new THREE.Mesh(geometry, material);
  mesh.position.y += 1;
  return mesh;
}
WireframeWorldLookAndFeel.prototype.getScene = function() {
  return [];
}
