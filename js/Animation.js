/**
 * Used for interpolating between position and rotation movement
 */

Animation = function(parent, type, start, end) {

  // critter
  this.parent = parent;

  // location : 0, rotation : 1
  this.type = type;
  this.start = start;
  this.end = end;

  // difference per frame
  if (type === 0) {
    this.dif = ((new THREE.Vector3(0, 0, 0)).subVectors(this.end, this.start)).multiplyScalar(1 / world.FRAMES_PER_TURN);
  }

  world.animations.push(this);
}

Animation.prototype = {
  update : function() {

    // location
    if (this.type === 0) {
      this.parent.mesh.position = this.start.add(this.dif);
    }
  }
}
