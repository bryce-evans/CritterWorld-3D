/**
 * WORLD
 *  used for global variables and holding the entire program state
 *
 * options includes all parameters for setting up the world including
 * map dimensions and initial state
 */

World = function(options) {
  this.container = document.getElementById('world');
  this.stats

  // if multiplayer
  this.server = true;
  if (this.server) {
    // {critter_id : critter}
    this.critters = {};
  }

  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 2000);

  // unneeded really but causes a bug without it
  this.camera.position.set(-15, 15, 15);
  this.camera.lookAt(new THREE.Vector3(5, 0, 15));

  this.projector = new THREE.Projector();

  this.map
  this.water
  this.mouseControls

  this.renderer
  this.particleLight, this.pointLight;
  // time step
  this.t = 0;
  this.clock = new THREE.Clock();

  // all fields shown in the UI
  this.data = {
    // number of critters in the world
    population : 0,
    // current step within the sim
    timeStep : 0,
  }

  this.animations = new Array();
  this.FRAMES_PER_TURN = 10;
  this.turn_occurring = false;
  this.current_frame = 0;

  this.COLUMNS = options.cols || 8;
  //49;
  this.ROWS = options.rows || 8;
  //67;
  this.population = options.population || 0;
  this.current_timestep = options.current_timestep || 0;
  this.rate = options.rate || 0;
  this.state = options.state || [];

  // options
  this.hi_res = this.ROWS * this.COLUMNS < 200;
  this.isVegetated = this.hi_res;
  this.hasWater = this.hi_res;
  this.hasTerrain = true;
  this.hasFog = this.hi_res;
  this.selectable = this.hi_res;
  this.animated = false;
  this.thickHexes = this.hi_res;

  this.SCREEN_WIDTH = window.innerWidth;
  this.SCREEN_HEIGHT = window.innerHeight;

  this.skies = {
    "lightblue" : 0xade0f4,
    "black" : 0x000000
  };
  this.color_codes = {};
  this.colors = [new THREE.Color(0xff0000), new THREE.Color(0xffff00), new THREE.Color(0x00ff00), new THREE.Color(0x00ffff), new THREE.Color(0xff00ff), new THREE.Color(0x0000ff)];
  this.color_step = -1;

}

World.prototype = {
  stringToColorCode : function(str) {

    if ( str in this.color_codes) {
      return this.color_codes[str];
    } else {
    	this.color_step++;
    	return (this.color_codes[str] = this.colors[this.color_step]);
    }
  },

  addAxes : function() {
    var x = new THREE.Geometry();

    x.vertices.push(new THREE.Vector3(0, 0, 0));
    x.vertices.push(new THREE.Vector3(10, 0, 0));

    var xmaterial = new THREE.LineBasicMaterial({
      color : 0xff0000
    });

    var xline = new THREE.Line(x, xmaterial);
    world.scene.add(xline);

    var y = new THREE.Geometry();
    y.vertices.push(new THREE.Vector3(0, 0, 0));
    y.vertices.push(new THREE.Vector3(0, 10, 0));

    var ymaterial = new THREE.LineBasicMaterial({
      color : 0x00ff00
    });

    yline = new THREE.Line(y, ymaterial);
    world.scene.add(yline);

    var z = new THREE.Geometry();
    z.vertices.push(new THREE.Vector3(0, 0, 0));
    z.vertices.push(new THREE.Vector3(0, 0, 10));

    var zmaterial = new THREE.LineBasicMaterial({
      color : 0x0000ff
    });

    zline = new THREE.Line(z, zmaterial);
    world.scene.add(zline);

  },
  updateToServer : function() {
    $.post({
      url : SERVER_URL + 'world' + SESSION,
      type: "POST",
      contentType: "application/json",
      data : JSON.stringify( {
        update_since : this.current_timestep
      })
    }).done( function(response) {
      console.log(response);
      if (response.current_timestep == this.current_timestep) {
        return;
      }
      this.current_timestep = response.current_timestep;
      this.map.update(response.state);
    }.bind(this));
  },
  updateStats : function() {
    document.getElementById("critter-count").innerHTML = (this.data.population);
    document.getElementById("time-count").innerHTML = (this.data.timeStep);
  }
}

