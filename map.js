Map = function() {
  this.hexes = new Array();

  this.hexSize = 3;
  this.hexBuffer = .25;

  this.hexRadius = (this.hexSize + this.hexBuffer) / 2;
  this.hexHeight = (this.hexRadius * Math.sqrt(3));

  this.hexColor = 0x00ffff;

  // (X,Y) -> (Z,X)
}
world.scene.map = new Map();

XYPoint = function() {
  var x;
  var y;

  this.print = function() {
    console.log("XY: (" + this.x + "," + this.y + ")");
  }
}
CRPoint = function() {
  this.c
  this.r

  this.print = function() {
    console.log("CR: (" + this.c + "," + this.r + ")");
  }
}
Hex = function(c, r) {

  this.location = new CRPoint();

  this.location.c = c;
  this.location.r = r;

  this.type
  this.contains

  this.addWire();
  this.addMesh();

}

Hex.prototype = {
  hasCritter : function() {

  },
  hasRock : function() {

  },
  isEmpty : function() {

  },
  /**
   *  takes a row and column and translates to x,y coordinate space
   * @param {Object} c
   * @param {Object} r
   */

  getRectCoord : function() {

    var x = this.location.c;
    var y = (this.location.r - .5 * this.location.c);

    var point = new XYPoint();
    point.x = x;
    point.y = y;

    return point;
  },

  addWire : function() {
    var geometry = new THREE.Geometry();
    this.material = new THREE.LineBasicMaterial({
      color : world.scene.map.hexColor
    });

    var xyPoint = this.getRectCoord();
    xyPoint.print();
    var xoffset = (xyPoint.x * world.scene.map.hexRadius) * 1.5;
    var yoffset = xyPoint.y * world.scene.map.hexHeight - world.scene.map.hexBuffer / 2;
    if (xyPoint.x % 2 != 0) {
      yoffset -= world.scene.map.hexHeight;
    }

    for (var i = 0; i <= 6; i++) {

      var xPoint = (xoffset + world.scene.map.hexSize / 2 * Math.cos(i * 2 * Math.PI / 6));
      var yPoint = (yoffset + world.scene.map.hexSize / 2 * Math.sin(i * 2 * Math.PI / 6));

      geometry.vertices.push(new THREE.Vector3(yPoint, 0.04, xPoint));
    }

    var mesh = new THREE.Line(geometry, this.material);
    world.scene.add(mesh);
  },

  addMesh : function() {
    var geometry = new THREE.Geometry();
    this.material = new THREE.MeshBasicMaterial({
      color : world.scene.map.hexColor,
      transparent: true,
      opacity: 0.3
    });

    var xyPoint = this.getRectCoord();
    xyPoint.print();
    var xoffset = (xyPoint.x * world.scene.map.hexRadius) * 1.5;
    var yoffset = xyPoint.y * world.scene.map.hexHeight - world.scene.map.hexBuffer / 2;
    if (xyPoint.x % 2 != 0) {
      yoffset -= world.scene.map.hexHeight;
    }

    for (var i = 0; i <= 6; i++) {

      var xPoint = (xoffset + world.scene.map.hexRadius / 2 * Math.cos(i * 2 * Math.PI / 6));
      var yPoint = (yoffset + world.scene.map.hexRadius / 2 * Math.sin(i * 2 * Math.PI / 6));

      geometry.vertices.push(new THREE.Vector3(yPoint, 0.04, xPoint));
    }

    var mesh = new THREE.Line(geometry, this.material);
    world.scene.add(mesh);
  }
}

/**
 * Draws a blank hex on the map
 * @param {Object} c
 * @param {Object} r
 */
function drawBlankHex(c, r) {
  var coords = hexToRectCoord(c, r);
  var x = coords.x;
  var y = coords.y;

  var rad = world.scene.map.scale * (world.scene.map.size + world.scene.map.buffer);

  var height = (rad * Math.sqrt(3));
  var xPoint = (x * 1.5 * rad);
  var yPoint = ((x % 2 == 0 ) ? y * height - world.scene.map.buffer / 2 : (y * height - world.scene.map.buffer / 2 - height / 2));

}

