WorldLookAndFeel = function() {
  this.model_loader = new THREE.JSONLoader();
  this.tex_loader = new THREE.TextureLoader();

  this.dir = "default/";
  this.critter_files = [];
  this.energy_files = [];
  
  this.critter_types = 1;
  this.energy_types = 1;
  this.rock_types = 1;
  this.decoration_types = 1;
  this.scene_objs = [];  

  this.models = {};
  this.models.critter = new Array(this.critter_types);
  this.models.energy = new Array(this.energy_types);
  this.models.rock = new Array(this.rock_types);
  this.decoration = new Array(this.decoration_types);
  this.models.scene = {};
  for (var i = 0; i < this.scene_objs.length; i++) {
    var obj_key = this.scene_objs[i];
    this.models.scene[obj_key] = undefined;
  }

  this.loaded = false;
  // string : int
  this.critter_species_model_map = {};
  
};

WorldLookAndFeel.prototype = {
  preloadModels : function() {
    preloadHelper("critter", this.models.critter);
    preloadHelper("decoration", this.models.critter);
    preloadHelper("rock", this.models.critter);
    preloadHelper("energy", this.models.critter);
    for(var i = 0; i < this.scene_objs.length; i++) {
      var obj = this.scene_objs[i];
      var out = new Array(1);
      var cb = function(mesh_list) {
        this.models.scene[obj] = mesh_list[0];
      };
      preloadHelper("scene/" + obj, out, {callback: cb}); 
    }
  },
  preloadHelper : function(type, out, options) {
    var count = out.length;
    var tex_ext = options.tex_ext || ".jpg";
    var dir = options.dir || this.rsc_dir + this.dir;
    var callback = options.callback || function(){};
    
    var look_and_feel = this;
    
    for (; i < this.critters; i++) {
      var path = dir + type + (i+1) + "/" + type;
      this.tex_loader.load(path + text_ext, function(texture) {
        look_and_feel.model_loader.load(dir + type + (this.i+1) + "/" + type+".json", function(geometry) {
          var material = new THREE.MeshBasicMaterial({
            map : texture,
            color : 0x888888,
          });

          out[this.i] = new THREE.Mesh(geometry, material);
        }.bind({i: this.i})); 
      }.bind({i: i}));      
    }  
  },
  getSceneModels : function() {
    return this.models.scene;
  },
  getHexModel : function(center, color, size, buffer) {
    var color = color || 0xffffff;
    var geometry = new THREE.Geometry();
    this.material = new THREE.LineBasicMaterial({
      color : color,
      linewidth : 1,
    });

    var xyPoint = center;

    var xoffset = (xyPoint.x * size) * 1.5;
    var yoffset = xyPoint.y * size * Math.sqrt(3) - buffer / 2;

    for (var i = 0; i <= 6; i++) {

      var xPoint = (xoffset + (size -buffer)  * Math.cos(i * 2 * Math.PI / 6));
      var yPoint = (yoffset + (size -buffer) * Math.sin(i * 2 * Math.PI / 6));

      geometry.vertices.push(new THREE.Vector3(yPoint, 0.04, xPoint));
    }

    return new THREE.Line(geometry, this.material);
  },

  /**
   * adds decoration to a hex, such as vegetation
   */
  decorateHex : function(hex) {
    return;
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
    return this.models.rock[0];
  },
};

