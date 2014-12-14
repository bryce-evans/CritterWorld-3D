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
  },
  // adds a list of items to the world
  addToMap : function(data) {
    var hex;
    for (var i = 0; i < data.length; i++) {
      if (data[i].type === "rock") {
        hex = this.hexes[data[i].col][data[i].row].addRock();
      } else if (data[i].type === "critter") {
        hex = this.hexes[data[i].col][data[i].row].addCritter(data[i]);
      }
    }
  }
}

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
  if (world.isVegetated) {
    this.addScenery();
  }

  if (!world.map.hexes[c]) {
    world.map.hexes[c] = new Array();
  }
  world.map.hexes[c][r] = (this);
}
Hex.prototype = {
  addCritter : function(data) {

    critter = new Critter(data);

    critter.add(this);
    this.type = 2;

  },
  addRock : function() {
    this.type = 1;
    var x = this.getPosX();
    var y = this.getPosY();
    //var size = .2;
    var rotation = Math.PI / 3 * Math.floor((Math.random() * 5));

    var rockTexture = new THREE.ImageUtils.loadTexture("../CritterWorld/rsc/obj/rock1/rock.jpg");

    function onRockLoad(geometry, materials) {

      var rockMaterial = new THREE.MeshBasicMaterial({
        map : rockTexture,
      });

      var mesh = new THREE.Mesh(geometry, rockMaterial);
      mesh.geometry.computeFaceNormals();
      mesh.position.copy(new THREE.Vector3(y, .1, x));
      mesh.rotation.y = rotation;
      //mesh.scale = new THREE.Vector3(size, size, size);
      world.scene.add(mesh);

    }


    loader.load("../CritterWorld/rsc/obj/rock1/rock1.js", onRockLoad);

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
    return Math.sqrt(3) * (this.location.r - .5 * this.location.c) * world.map.hexRadius;
  },
  getPosX : function() {
    return (this.location.c) * 1.5 * world.map.hexRadius;

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
  updateStats : function() {
    if (this.type === 0) {
      $("#critter-data").hide();
      $("#critter-prog").hide();
      $("#current-hex-type").innerHTML = (" ");
    } else if (this.type === 1) {
      $("#current-hex-type").innerHTML = ("Rock");
      $("#critter-data").hide();
      $("#critter-prog").hide();
    } else if (this.type === 2) {
      $("#critter-data").show();
      $("#critter-prog").show();

      $("#current-hex-type").text("Critter");
      $("#critter-species").text(this.critter.data.species);
      // XXX
      $("#critter-energy").text(this.critter.data.mem[4]);
      $("#critter-size").text(this.critter.data.mem[3]);
      $("#prog-area").text(this.critter.data.program);
    }
  },
  //draws the wire around the hex
  addWire : function() {
    var geometry = new THREE.Geometry();
    this.material = new THREE.LineBasicMaterial({
      color : world.map.hexColor,
      linewidth : 3
    });

    var xyPoint = this.getRectCoord();

    var xoffset = (xyPoint.x * world.map.hexRadius) * 1.5;
    var yoffset = xyPoint.y * world.map.hexHeight - world.map.hexBuffer / 2;

    for (var i = 0; i <= 6; i++) {

      var xPoint = (xoffset + world.map.hexSize / 2 * Math.cos(i * 2 * Math.PI / 6));
      var yPoint = (yoffset + world.map.hexSize / 2 * Math.sin(i * 2 * Math.PI / 6));

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
      color : world.map.hexColor,
      transparent : true,
      opacity : 0.001
    });

    var xyPoint = this.getRectCoord();
    // xyPoint.print();
    var xoffset = (xyPoint.x * world.map.hexRadius) * 1.5;
    var yoffset = xyPoint.y * world.map.hexHeight - world.map.hexBuffer / 2;

    for (var i = 0; i < 6; i++) {

      var xPoint = (xoffset + world.map.hexRadius * Math.cos(i * 2 * Math.PI / 6));
      var yPoint = (yoffset + world.map.hexRadius * Math.sin(i * 2 * Math.PI / 6));

      geometry.vertices.push(new THREE.Vector3(yPoint, 0.02, xPoint));
    }

    for (var i = 1; i < 5; i++) {
      geometry.faces.push(new THREE.Face3(0, i, i + 1));
    }

    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.hex = this;
    world.map.hexGeometries.push(mesh);
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
      //mesh.position = new THREE.Vector3(y, .1, x);
      mesh.position.x = y;
      mesh.position.y = .1;
      mesh.position.z = x;

      mesh.rotation.y = rotation;
      mesh.scale.x = size;
      mesh.scale.y = size;
      mesh.scale.z = size;
      //mesh.scale = new THREE.Vector3(size, size, size);
      console.log(size);
      world.scene.add(mesh);

    }

    function onTrunkLoad(geometry, materials) {

      var trunkMaterial = new THREE.MeshBasicMaterial({
        map : trunkTexture,
        opacity : opacity,
      });

      var mesh = new THREE.Mesh(geometry, trunkMaterial);
      mesh.geometry.computeFaceNormals();
      //mesh.position = new THREE.Vector3(y, .1, x);
      mesh.position.x = y;
      mesh.position.y = .1;
      mesh.position.z = x;
      mesh.rotation.y = rotation;
      //  mesh.scale = new THREE.Vector3(size, size, size);
      mesh.scale.x = size;
      mesh.scale.y = size;
      mesh.scale.z = size;

      world.scene.add(mesh);

    }


    loader.load("../CritterWorld/rsc/obj/tree1/branches.js", onBranchesLoad);
    loader.load("../CritterWorld/rsc/obj/tree1/trunk.js", onTrunkLoad);
  }
}

