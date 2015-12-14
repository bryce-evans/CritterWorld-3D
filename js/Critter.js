Critter = function(mesh, data) {
  this.mesh = mesh;
  this.data = {
    direction : data.direction,
    id : data.id,
    mem : data.mem,
    program : data.program,
    recent_rule : data.recently_executed_rule,
    species : data.species_id
  };

  // if interacting with a server, keep id for querying data and making updates.
  if (world.server) {
    world.critters[data.id] = this;
  }

  //this.energy = 100;
  this.hex = null;
  //this.size = 1;
  this.orientation = 0;
  this.ruleset = "";

  this.animation_handler = undefined;

}
Critter.prototype = {
  add : function(hex) {

    this.hex = hex;
    hex.critter = this;

    function ensureLoop(animation) {

      for (var i = 0; i < animation.hierarchy.length; i++) {

        var bone = animation.hierarchy[i];

        var first = bone.keys[0];
        var last = bone.keys[bone.keys.length - 1];

        last.pos = first.pos;
        last.rot = first.rot;
        last.scl = first.scl;

      }

    }

    addToWorld = function(geometry, materials) {
      this.mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
      this.mesh.geometry.computeFaceNormals();
      enableSkinning(this.mesh);

      ensureLoop(geometry.animation);
      // for (var i = 0; i < this.mesh.bones; i++) {
      // this.mesh.bones[i].useQuaternion = false;
      // }

      this.setPosToHex(hex);
      this.mesh.scale.x = .5;
      this.mesh.scale.y = .5;
      this.mesh.scale.z = .5;
      this.mesh.material.materials[0].color = world.stringToColorCode(this.data.species);
      //this.mesh.scale = new THREE.Vector3(.2, .2, .2);

      // random orientation
      //this.orientation = Math.floor((Math.random() * 6));
      this.mesh.rotation.y -= Math.PI / 2 + Math.PI / 3 * this.orientation;
      world.scene.add(this.mesh);

      if (world.animated) {
        this.animation_handler = new AnimationHandler(this)
      };
    }.bind(this);

    function enableSkinning(skinnedMesh) {
      var materials = skinnedMesh.material.materials;
      for (var i = 0, length = materials.length; i < length; i++) {
        var mat = materials[i];
        mat.skinning = true;
      }
    }

    if (true) {
      loader.load(critterpath, addToWorld);

    } else {
      loader.load(critterpath, function(geometry) {

        var material = new THREE.MeshBasicMaterial({
          color : world.stringToColorCode(this.data.species),
          shading : THREE.FlatShading,
        });
        this.mesh = new THREE.Mesh(geometry, material);

        this.setPosToHex(hex);
        this.mesh.scale.x = .5;
        this.mesh.scale.y = .5;
        this.mesh.scale.z = .5;

        world.scene.add(this.mesh);
      }.bind(this));
    }

  },

  // updates loc, rot
  update : function(col, row, direction) {
    this.setPosToHex(world.map.hexes[col][row]);
    this.setOrientation(direction);
  },
  setOrientation : function(orientation) {
    this.orientation = orientation;
    this.mesh.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2 + -Math.PI / 3 * (this.orientation));
  },
  setPosition : function(c, r) {
    this.setPosToHex(world.map.hexes[c][r])
  },
  // moves the critter to the input hex
  // REQUIRES: hex is empty (.type == 2)
  setPosToHex : function(hex) {
    var new_pos = new THREE.Vector3(hex.getPosY(), .1, hex.getPosX());
    if (world.animated) {
      this.animation_handler.create(0, new_pos, new THREE.Vector3(hex.getPosY(), 0.1, hex.getPosX()));
    } else {
      this.mesh.position.copy(new_pos);
    }
//    this.updateHexToCritter(hex);
  },

  updateHexToCritter : function(hex) {
    this.hex.type = 0;
    hex.type = 2;
    world.critterControls.setSelected(hex);
  },
  moveForward : function() {
    var pos = this.hex.location;

    var newHex = null;

    switch(this.orientation) {
      case 0:
        newHex = world.map.getHex(pos.c, pos.r + 1);
        break;
      case 1:
        newHex = world.map.getHex(pos.c + 1, pos.r + 1);
        break;
      case 2:
        newHex = world.map.getHex(pos.c + 1, pos.r);
        break;
      case 3:
        newHex = world.map.getHex(pos.c, pos.r - 1);
        break;
      case 4:
        newHex = world.map.getHex(pos.c - 1, pos.r - 1);
        break;
      case 5:
        newHex = world.map.getHex(pos.c - 1, pos.r);
        break;
    }

    // return if hex is not empty
    if (newHex.type !== 0) {
      return;
    }

    // set up movement
    this.setPosToHex(newHex);

    // update hex data
    this.hex.critter = null;
    this.hex = newHex;
    this.hex.critter = this;

    world.critterControls.setSelected(this.hex);

  },
  moveBackward : function() {
    this.incrementOrientation(3);
    this.moveForward();
    this.incrementOrientation(3);
  },

  // REQUIRES: i in range [-6,6]
  incrementOrientation : function(i) {
    this.orientation = (this.orientation + 6 + i) % 6;
  },

  turnRight : function() {
    this.incrementOrientation(1);
    this.mesh.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2 + -Math.PI / 3 * (this.orientation));
  },

  turnLeft : function() {
    this.incrementOrientation(-1);
    this.mesh.quaternion.setFromAxisAngle(new THREE.Vector3(0, -1, 0), Math.PI / 2 + Math.PI / 3 * (this.orientation));
  }
}
