WorldLookAndFeel = function() {
  this.model_loader = new THREE.JSONLoader();
  this.tex_loader = new THREE.TextureLoader();

  this.rsc_dir = "rsc/world_styles/"
  this.dir = "default/";
  
  this.hex_colors = {
    base : 0xaaaaaa,
    hover : 0xffffff,
    highlight: 0xff8800,  
  };
  this.critter_files = [];
  this.energy_files = [];
  
  this.critter_types = 1;
  this.energy_types = 1;
  this.rock_types = 1;
  this.decoration_types = 1;
  this.scene_objs = [];  

  this.items_remaining = 2 * (this.critter_types + this.energy_types + this.rock_types + this.decoration_types + Object.keys(this.scene_objs));  

  this.models = {};
  this.models.critter = new Array(this.critter_types);
  this.models.energy = new Array(this.energy_types);
  this.models.rock = new Array(this.rock_types);
  this.models.decoration = new Array(this.decoration_types);
  this.models.scene = {};
  for (var i = 0; i < this.scene_objs.length; i++) {
    var obj_key = this.scene_objs[i];
    this.models.scene[obj_key] = undefined;
  }
  
  // list of models requested but that haven't loaded yet
  this.futures = {};
  this.futures.critter = [];
  this.futures.energy = [];
  this.futures.rock = [];
  this.futures.decoration = [];
  this.futures.scene = {};

  this.loaded = false;
  // string : int
  this.critter_species_model_map = {};

  
};

WorldLookAndFeel.prototype = {
  load : function(callback) {
    this.onLoadCallback = callback;    

    this.loadHelper("critter", this.models.critter);
    this.loadHelper("decoration", this.models.decoration);
    this.loadHelper("rock", this.models.rock);
    this.loadHelper("energy", this.models.energy);
    for(var i = 0; i < this.scene_objs.length; i++) {
      var obj = this.scene_objs[i];
      var out = new Array(1);
      var cb = function(mesh_list) {
        this.models.scene[obj] = mesh_list[0];
      };
      this.loadHelper("scene/" + obj, out); 
    }
  },
  loadHelper : function(type, out, options) {
    var count = out.length;
    var options = options || {};
    var tex_ext = options.tex_ext || ".jpg";
    var dir = options.dir || this.rsc_dir + this.dir;
    
    var look_and_feel = this;
    
    for (var i = 0; i < count; i++) {
      var path = dir + type + "/" + type + (i+1) + "/" + type + (i+1);
      out[i] = {};
      this.tex_loader.load(path + tex_ext, function(texture) {
          var material = new THREE.MeshBasicMaterial({
            map : texture,
            color : 0x888888,
          });
          out[this.i]["material"]  = material;
          look_and_feel.markObjectLoaded();
          look_and_feel.loadFuturesMaterial(type, this.i, material);
      }.bind({i:i}));
      this.model_loader.load(path +".json", function(geometry) {
         geometry.computeFaceNormals();
         out[this.i]["geometry"]  = geometry;
         look_and_feel.markObjectLoaded();
         look_and_feel.loadFuturesGeometry(type, this.i, geometry);
      }.bind({i : i})); 
    }  
  },
  markObjectLoaded : function() {
    this.items_remaining--;
    if (this.items_remaining === 0) {
      this.loaded = true;
      this.onLoadCallback();
    }
  },
  loadFuturesGeometry : function(type, index, geometry) {
    var list = this.futures[type][index];
    for (var i = 0; i < list.length; i++) {
      list[i].onGeometryLoad(geometry);  
    }
    // material is loaded, no more futures!
    if (this.models[type].material) {
      list = []; 
    }
  },
  loadFuturesMaterial : function(type, index, material) {
    var list = this.futures[type][index];
    for (var i = 0; i < list.length; i++) {
      list[i].onMaterialLoad(material);  
    }
    // geometry is loaded, no more futures!
    if (this.models[type].geometry) {
      list = []; 
    }
  },
    
  addSceneModels : function(scene) {
    return;
  },
  getHexWire : function(center, color, radius, buffer) {
    var geometry = new THREE.Geometry();
    var color = color || 0xffffff;
    this.material = new THREE.LineBasicMaterial({
      color : color,
      linewidth : 1,
    });

    var xyPoint = center;

    var xoffset = (xyPoint.x * radius) * 1.5;
    var yoffset = xyPoint.y * radius * Math.sqrt(3);

    for (var i = 0; i <= 6; i++) {

      var xPoint = (xoffset + (radius-buffer) * Math.cos(i * 2 * Math.PI / 6));
      var yPoint = (yoffset + (radius-buffer) * Math.sin(i * 2 * Math.PI / 6));

      geometry.vertices.push(new THREE.Vector3(yPoint, 0.04, xPoint));
    }

    var wire = new THREE.Line(geometry, this.material);
    wire.origColor = color;
    return wire;
  },
  getHexColors : function() {
    return this.hex_colors;
  },

  /**
   * adds decoration to a hex, such as vegetation
   */
  getDecorations : function() {
    return [];
  },
  getCritterModel : function(species) {
    if (species in this.critter_species_model_map) {
      return this.critter_species_model_map[species];
    } else {
      var next_index = Object.keys(this.critter_species_model_map).length;
      var model_count = this.models.critter.length;
      this.critter_species_model_map[species] = this.models.critter[next_index % model_count];
    }
  },
  getEnergyModel : function(energy_amount) {
    return this.models.energy[0];
  },
  getRock : function(size) {  
    var size = size || 1;
    var i = 0;
    var rock_data = this.models.rock[i];
    
    var future = new FutureMesh("rock", i, rock_data.geometry, rock_data.material);
    if (!future.loaded) {
      var future_lst = this.futures.rock;
      if (!future_lst[i]) {
        future_lst[i] = [];
      }
      future_lst[i].push(future);
    } 
    var rotation = Math.PI / 3 * Math.floor((Math.random() * 5));
    future.mesh.rotation.y = rotation;
    return future.mesh;
  },
};

/**
 *  THREE.Mesh but can be temporarily null and then loaded later
 */
FutureMesh = function(type, index, geometry, material) {
  this.geometry = geometry;
  this.material = material;
  this.loaded = this.geometry !== undefined && this.material !== undefined;
  this.type = type;
  this.index = index;

  var geometry = geometry || new THREE.BoxGeometry(1,1,1);
  var material = material            
    || new THREE.MeshBasicMaterial({
        color: 0xaa0000,
        wireframe: true 
    });
  
  this.mesh = new THREE.Mesh(geometry, material);
}
FutureMesh.prototype = {
  onGeometryLoad : function(geometry) {
    this.geometry = geometry;
    this.loaded = this.geometry !== undefined && this.material !== undefined;
    
    if(this.loaded) {
      this.reload();
    } 
   },
  onMaterialLoad : function(material) {
    this.material = material;
    this.loaded = this.geometry !== undefined && this.material !== undefined;
    if (this.loaded) {
      this.reload();
    }
  },
  reload : function() {
    world.scene.remove(this.mesh);
    var mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.position.copy(this.mesh.position);
    mesh.rotation.copy(this.mesh.rotation);
    this.mesh = mesh;
    world.scene.add(this.mesh); 
  },
}
