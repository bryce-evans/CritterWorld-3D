/**
 * WORLD
 *  used for global variables and holding the entire program state 
 */

World = function() {
  this.container = document.getElementById('world');
  this.stats

  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 2000);
  this.camera.position.set(-15, 15, 15);
  this.lookAt = (new THREE.Vector3(5, 0, 15));
  

	this.projector = new THREE.Projector();
	
	this.water;
	this.mouseControls;
	
  this.renderer;
  this.particleLight, this.pointLight;
  this.t = 0;
  this.clock = new THREE.Clock();
  
  this.isAnimated = true;
  this.animations = new Array();
  this.FRAMES_PER_TURN = 10;
  this.turnOccurring = false;
  this.currentFrame = 0;

  this.COLUMNS = 15;
  this.ROWS = 15;

  this.SCREEN_WIDTH = window.innerWidth;
  this.SCREEN_HEIGHT = window.innerHeight;

}

World.prototype = {
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

  }
}

world = new World();
