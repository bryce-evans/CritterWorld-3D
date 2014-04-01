XYPoint = function() {
  this.x
  this.y

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
Map = function(world) {
  this.world = world;
  this.hexes = new Array();
  this.hexGeometries = new Array();

  this.hexSize = 3;
  this.hexBuffer = .25;

  this.hexRadius = (this.hexSize + this.hexBuffer) / 2;
  this.hexHeight = (this.hexRadius * Math.sqrt(3));

  this.hexColor = 0x8bf600;

  this.size = new XYPoint();
  this.center = new XYPoint();

  this.animations = new Array();
}
Map.prototype = {
  calculateSize : function() {
    this.size.x = 2 * this.hexSize * (this.world.ROWS + 2) / 3;
    this.size.y = this.hexSize * (this.world.COLUMNS + 2);

    this.center.x = this.size.x / 2 - this.hexSize;
    this.center.y = this.size.y / 2 - this.hexSize;
  }
}
world.scene.map = new Map(world);
world.scene.map.calculateSize();

Hex = function(c, r) {

  this.location = new CRPoint();

  this.location.c = c;
  this.location.r = r;

  // 0 : empty, 1 : rock, 2 : critter
  this.type = 0;
  this.contains

  this.wire

  this.addWire();
  this.addMesh();

  world.scene.map.hexes.push(this);
}

Hex.prototype = {
  addCritter : function() {

    critter = new Critter();

    critter.add(this);
    this.type = 2;

  },
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
  getPosY : function() {
    return Math.sqrt(3) * (this.location.r - .5 * this.location.c) * world.scene.map.hexRadius;
  },
  getPosX : function() {
    return (this.location.c) * 1.5 * world.scene.map.hexRadius;

  },

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
      color : world.scene.map.hexColor,
      linewidth : 3
    });

    var xyPoint = this.getRectCoord();

    var xoffset = (xyPoint.x * world.scene.map.hexRadius) * 1.5;
    var yoffset = xyPoint.y * world.scene.map.hexHeight - world.scene.map.hexBuffer / 2;

    for (var i = 0; i <= 6; i++) {

      var xPoint = (xoffset + world.scene.map.hexSize / 2 * Math.cos(i * 2 * Math.PI / 6));
      var yPoint = (yoffset + world.scene.map.hexSize / 2 * Math.sin(i * 2 * Math.PI / 6));

      geometry.vertices.push(new THREE.Vector3(yPoint, 0.04, xPoint));
    }

    var mesh = new THREE.Line(geometry, this.material);
    this.wire = mesh;
    world.scene.add(mesh);
  },

  addMesh : function() {
    var geometry = new THREE.Geometry();
    this.material = new THREE.MeshBasicMaterial({
      color : world.scene.map.hexColor,
      transparent : true,
      opacity : 0.001
    });

    var xyPoint = this.getRectCoord();
    // xyPoint.print();
    var xoffset = (xyPoint.x * world.scene.map.hexRadius) * 1.5;
    var yoffset = xyPoint.y * world.scene.map.hexHeight - world.scene.map.hexBuffer / 2;

    for (var i = 0; i < 6; i++) {

      var xPoint = (xoffset + world.scene.map.hexRadius * Math.cos(i * 2 * Math.PI / 6));
      var yPoint = (yoffset + world.scene.map.hexRadius * Math.sin(i * 2 * Math.PI / 6));

      geometry.vertices.push(new THREE.Vector3(yPoint, 0.02, xPoint));
    }

    for (var i = 1; i < 5; i++) {
      geometry.faces.push(new THREE.Face3(0, i, i + 1));
    }

    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.hex = this;
    world.scene.map.hexGeometries.push(mesh);
    world.scene.add(mesh);
  }
}

