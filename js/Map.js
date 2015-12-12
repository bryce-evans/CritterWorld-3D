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

  
  this.look_and_feel = new WireframeWorldLookAndFeel();
  this.look_and_feel.load();   

  // cache the colors for faster access
  this.hex_colors = this.look_and_feel.getHexColors();
 
  // an array of arrays
  // hexes[c][r] returns hex at (c,r)
  this.hexes = new Array();

  // used strictly for selecting hex with mouse
  this.hexGeometries = new Array();

  this.hexSize = 3;
  this.hexBuffer = .25;

  this.hexRadius = (this.hexSize + this.hexBuffer) / 2;
  this.hexHeight = (this.hexSize * Math.sqrt(3));

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
  addAll : function(data) {
    var hex;
    for (var i = 0; i < data.length; i++) {
      if (data[i].type === "rock") {
        this.hexes[data[i].col][data[i].row].addRock();
      } else if (data[i].type === "critter") {
        this.hexes[data[i].col][data[i].row].addCritter(data[i]);
      }
    }
  },
  update : function(state) {

    var new_pieces = [];

    // hashset of already existing but valid ids
    var cur_ids = {};

    for (var i = 0; i < state.length; i++) {

      var obj = state[i];

      if (obj.type == "rock") {
        this.hexes[obj.col][obj.row].addRock();
        continue;
      }

      var c = world.critters[obj.id];

      // new!
      if (!c) {
        new_pieces.push(obj);
      } else {
        cur_ids[obj.id] = {
          row : obj.row,
          col : obj.col,
          direction : obj.direction,
        };
      }
    }
    var critter_keys = Object.keys(world.critters);
    for (var i = 0; i < critter_keys.length; i++) {
      var key = critter_keys[i];

      var c = world.critters[key];
      var update = cur_ids[key];

      // updated!
      if (update) {

        c.update(update.col, update.row, update.direction);

        // dead! delete!
      } else { debugger;
        world.scene.remove(c.mesh);
        delete world.critters[key];
      }

    }
    this.addAll(new_pieces);

  },
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
  if (world.selectable) {
    this.addMesh();
  }
  this.addDecorations();

  if (!world.map.hexes[c]) {
    world.map.hexes[c] = new Array();
  }
  world.map.hexes[c][r] = (this);
}
Hex.prototype = {
  addCritter : function(data) {
    var mesh = this.look_and_feel.getCritter(data.id);
    critter = new Critter(mesh, data);

    critter.add(this);
    this.type = 2;

  },
  addRock : function() {
    // already a rock
    // TODO should not be adding multiple rocks on map update
    if (this.type == 1) {
      return;
    }
    this.type = 1;
    
    var x = this.getPosX();
    var y = this.getPosY();

    var mesh = world.map.look_and_feel.getRock();
    mesh.position.x = y;
    mesh.position.z = x;

    world.scene.add(mesh);

  },
  addFood : function() {
    var geometry = new THREE.SphereGeometry(5, 8, 8);
    var material = new THREE.MeshBasicMaterial({
      color : world.stringToColorCode(this.data.species),
      shading : THREE.FlatShading,
    });
    var mesh = new THREE.Mesh(geometry, material);

    mesh.setPosToHex(hex);
    mesh.mesh.scale.x = .5;
    mesh.mesh.scale.y = .5;
    mesh.mesh.scale.z = .5;

    mesh.position.x = y;
    mesh.position.z = x;

    this.type = 0;
    var x = this.getPosX();
    var y = this.getPosY();

    world.scene.add(this.mesh);
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
      if (this.critter != undefined) {
        $("#critter-species").text(this.critter.data.species);
        // XXX
        $("#critter-energy").text(this.critter.data.mem[4]);
        $("#critter-size").text(this.critter.data.mem[3]);
        $("#prog-area").text(this.critter.data.program);
      }
    }
  },
  //draws the wire around the hex
  addWire : function() {
    this.wire = world.map.look_and_feel.getHexWire(this.getRectCoord(), world.map.hexRadius, world.map.hexBuffer);
    world.scene.add(this.wire);
  },

  // draws the hex mesh for mouse click collision detection
  addMesh : function() {
    var geometry = new THREE.Geometry();
    this.material = new THREE.MeshBasicMaterial({
      color : world.map.hexColor,
      transparent : true,
      opacity : 0.1
    });

    var xyPoint = this.getRectCoord();
    // xyPoint.print();
    var xoffset = (xyPoint.x * world.map.hexRadius) * 1.5;
    var yoffset = xyPoint.y * world.map.hexRadius * Math.sqrt(3) - world.map.hexBuffer / 2;

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
    //world.scene.add(mesh);
  },
  highlight : function() {
  var wire  = this.wire;
  if(wire.material) {
          wire.material.color.setHex(world.map.hex_colors["hover"]);
        } else {
       
          $.each(wire.children, function(i,w){
             w.material.color.setHex(world.map.hex_colors["hover"]);
          }.bind(this));
}
         },
  unhighlight : function() {
      var wire = this.wire;
      if(wire.material) {
          wire.material.color.setHex(wire.origColor);
        } else {
       
          $.each(wire.children, function(i,w){
             w.material.color.setHex(wire.origColor);
          }.bind(this));
}   
  },
  highlightSelected : function() {
         var wire = this.wire;
        if (wire.material) { 
          wire.material.color.setHex(world.map.hex_colors["selected"]);
        } else {
       
          $.each(wire.children, function(i,w){
             w.material.color.setHex(world.map.hex_colors["selected"]);
          }.bind(this));
}

  },
  // add some shrubbery
  addDecorations : function() {
    var x = this.getPosX();
    var y = this.getPosY();
    var decors = world.map.look_and_feel.getDecorations();
    for (var i = 0; i < decors.length; i++) {
      decors[i].position.add(this.get3DCenter)();
      world.scene.add(decors);
    }
  },
  // returns Vector3
  get3DCenter : function() {
    var xyPoint = this.getRectCoord();
    // xyPoint.print();
    var xoffset = (xyPoint.x * world.map.hexRadius) * 1.5;
    var yoffset = xyPoint.y * world.map.hexRadius * Math.sqrt(3) - world.map.hexBuffer / 2;
    return new THREE.Vector3(yoffset, 0.0, xoffset);
  }
}

