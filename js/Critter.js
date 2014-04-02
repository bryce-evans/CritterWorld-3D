// LEMURS!!
var critterpath = "../CritterWorld/rsc/obj/lemur_run1.js";
var critteraction = "LemurAction";

var loader = new THREE.JSONLoader();

Critter = function() {
  this.energy = 100;
  this.hex = null;
  this.size = 1;
  this.orientation = 0;
  this.ruleset = "";

  this.mesh

}
Critter.prototype = {
  add : function(hex) {

    this.hex = hex;

    function addToWorld(geometry, materials) {
      this.mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
      this.mesh.geometry.computeFaceNormals();
      enableSkinning(this.mesh);

      this.mesh.position = new THREE.Vector3(hex.getPosY(), .1, hex.getPosX());
      this.mesh.scale = new THREE.Vector3(.2, .2, .2);
      world.scene.add(this.mesh);

      THREE.AnimationHandler.add(this.mesh.geometry.animation);

      animation_critter = new THREE.Animation(this.mesh, critteraction, THREE.AnimationHandler.CATMULLROM);
      world.scene.map.animations.push(animation_critter);

      animation_critter.play();
    }

    function enableSkinning(skinnedMesh) {
      var materials = skinnedMesh.material.materials;
      for (var i = 0, length = materials.length; i < length; i++) {
        var mat = materials[i];
        mat.skinning = true;
      }
    }


    loader.load(critterpath, addToWorld);

  }
}
