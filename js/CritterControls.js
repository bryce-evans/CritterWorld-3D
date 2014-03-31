CritterControls = function() {
  this.currentCritter = null;

}

CritterControls.prototype = {
  setSelected : function(critter) {
    if (this.currentCritter) {
      this.currentCritter.object.material.color.setHex(0x000000);
    }
    this.currentCritter = critter;
    this.currentCritter.object.material.color.setHex(0xffffff);
  }
}

world.critterControls = new CritterControls();
