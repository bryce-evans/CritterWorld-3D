/**
 * Modified from
 * http://srchea.com/apps/terrain-generation-diamond-square-threejs-webgl/js/classes/Scene.js
 *
 */

Terrain = function() {
  this.terrain = new Array();

  this.texture = 'rsc/textures/grass.jpg';
  this.material = this.material = new THREE.MeshBasicMaterial({
    map : THREE.ImageUtils.loadTexture(this.texture)
  });
  this.width = 500;
  this.height = 500;
  this.segments = 64;
  this.smoothingFactor = 60;
  this.terrain = new Array();
  this.border = false;
  this.info = false;
  this.deepth = -80;

  this.geometry;
  this.mesh;
  this.combined;

  this.updateTerrain = function(width, height, segments, smoothingFactor) {
    this.width = width;
    this.height = height;
    this.segments = segments;
    this.smoothingFactor = smoothingFactor;

    var terrainGeneration = new TerrainGeneration(this.width, this.height, this.segments, this.smoothingFactor);
    this.terrain = terrainGeneration.diamondSquare();

    this.geometry = new THREE.PlaneGeometry(this.width, this.height, this.segments, this.segments);
    var index = 0;
    for (var i = 0; i <= this.segments; i++) {
      for (var j = 0; j <= this.segments; j++) {
        this.geometry.vertices[index].z = this.terrain[i][j];
        index++;
      }
    }

  };

  this.setTexture = function(texture) {
    this.texture = texture;
    if (this.texture !== null) {
      this.material = new THREE.MeshBasicMaterial({
        map : THREE.ImageUtils.loadTexture(this.texture)
      });
    } else {
      this.material = new THREE.MeshBasicMaterial({
        color : 0x000000,
        wireframe : true
      });
    }

    //world.scene.remove(this.mesh);
    if (this.border) {
      this.mesh = new THREE.Mesh(this.combined, this.material);
    } else {
      this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    this.mesh.rotation.x = Math.PI / 180 * (-90);

  };

  this.setFog = function() {
    world.scene.fog = new THREE.Fog(0xffffff, 10,300);
  };
  //this.setFog();
}

var terrain = new Terrain();
var map = world.scene.map;
terrain.updateTerrain(map.size.x,  map.size.y , terrain.segments, 3);

world.scene.terrain = terrain;
terrain.setTexture(terrain.texture);
terrain.setFog(terrain.fog);

terrain.mesh.position = new THREE.Vector3(map.center.x,-2,map.center.y) ;

world.scene.add(terrain.mesh);


