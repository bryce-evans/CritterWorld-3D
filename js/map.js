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

  // an array of arrays
  // hexes[c][r] returns hex at (c,r)
  this.hexes = new Array();

  // used strictly for selecting hex with mouse
  this.hexGeometries = new Array();

  this.hexSize = 3;
  this.hexBuffer = .25;

  this.hexRadius = (this.hexSize + this.hexBuffer) / 2;
  this.hexHeight = (this.hexRadius * Math.sqrt(3));

  this.hexColor = 0x8bf600;

  this.size = new XYPoint();
  this.center = new XYPoint();

  this.animations = new Array();
  this.frameDelta = 0;
}
Map.prototype = {
  calculateSize : function() {
    this.size.x = 2 * this.hexSize * (this.world.ROWS + 2) / 3;
    this.size.y = this.hexSize * (this.world.COLUMNS + 2);

    this.center.x = this.size.x / 2 - this.hexSize;
    this.center.y = this.size.y / 2 - this.hexSize;
  },

  // returns the hex at c,r
  getHex : function(c, r) {
    return this.hexes[c][r];
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
  this.critter

  this.wire

  this.addWire();
  this.addMesh();
  //this.addScenery();

  if (!world.scene.map.hexes[c]) {
    world.scene.map.hexes[c] = new Array();
  }
  world.scene.map.hexes[c][r] = (this);
}

Hex.prototype = {
  addCritter : function() {

    critter = new Critter();

    critter.add(this);
    this.type = 2;

  },
  hasCritter : function() {
    return this.type === 2;
  },
  hasRock : function() {
    return this.type === 1;
  },
  isEmpty : function() {
    return this.type === 0;
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

  // gets the location of this hex
  getRectCoord : function() {

    var x = this.location.c;
    var y = (this.location.r - .5 * this.location.c);

    var point = new XYPoint();
    point.x = x;
    point.y = y;

    return point;
  },

  //draws the wire around the hex
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

  // draws the hex mesh for mouse click collision detection
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
  },
  // add some shrubbery
  addScenery : function() {
    var x = this.getPosX();
    var y = this.getPosY();
    var opacity = 1;
    var size = Math.random() * .1 + .1;
    var rotation = Math.PI / 3 * Math.floor((Math.random() * 5));

    var branchTexture = new THREE.ImageUtils.loadTexture("../CritterWorld/rsc/obj/tree1/branch.png");
    var trunkTexture = new THREE.ImageUtils.loadTexture("../CritterWorld/rsc/obj/tree1/bark.jpg");

    function onBranchesLoad(geometry, materials) {

      var branchMaterial = new THREE.MeshBasicMaterial({
        map : branchTexture,
        opacity : opacity,
        transparent : true
      });
      var mesh = new THREE.Mesh(geometry, branchMaterial);
      mesh.geometry.computeFaceNormals();
      mesh.position = new THREE.Vector3(y, .1, x);
      mesh.rotation.y = rotation;
      mesh.scale = new THREE.Vector3(size, size, size);
      world.scene.add(mesh);

    }

    function onTrunkLoad(geometry, materials) {

      var trunkMaterial = new THREE.MeshBasicMaterial({
        map : trunkTexture,
        opacity : opacity,
      });

      var mesh = new THREE.Mesh(geometry, trunkMaterial);
      mesh.geometry.computeFaceNormals();
      mesh.position = new THREE.Vector3(y, .1, x);
      mesh.rotation.y = rotation;
      mesh.scale = new THREE.Vector3(size, size, size);
      world.scene.add(mesh);

    }


    loader.load("../CritterWorld/rsc/obj/tree1/branches.js", onBranchesLoad);
    loader.load("../CritterWorld/rsc/obj/tree1/trunk.js", onTrunkLoad);
  }
}

