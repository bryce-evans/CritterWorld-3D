/**
 * Used for interpolating between position and rotation movement
 */

AnimationHandler = function(parent) {

  // critter
  this.parent = parent;

  // location : 0, rotation : 1
  this.type = undefined;
  this.start = undefined;
  this.end = undefined;

  this.active = false;

  this.frame = 1;
  this.max_frame = 10;

  this.animation = new THREE.Animation(this.parent.mesh, this.parent.mesh.geometry.animation);
  this.animation.play();
  
  world.map.animations.push(this.animation);

  world.animations.push(this);

}

AnimationHandler.prototype = {

  create : function(type, start, end) {
    //append to current animation
    if (this.active) {
      start = new THREE.Vector3().copy(this.parent.mesh.position)
    }

    this.active = true;
    //this.animation.play();

    this.type = type;
    this.start = start;
    this.end = end;

    this.frame = 1;
    this.diff = ((new THREE.Vector3(0, 0, 0)).subVectors(end, start)).multiplyScalar(1 / this.max_frame);

  },
  update : function() {
    if (this.active) {

      // location
      if (this.type === 0) {
        this.parent.mesh.position.add(this.diff);
        // = new THREE.Vector3().copy(this.parent.mesh.position.add(this.dif));
        this.frame++;
        if (this.frame > this.max_frame) {

          this.active = false;
          //this.animation.stop();
          this.frame = 1;
        }

      }
    }
  }
}
