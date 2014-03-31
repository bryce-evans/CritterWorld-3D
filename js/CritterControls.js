CritterControls = function() {
  this.currentHex = null;

}

CritterControls.prototype = {
  setSelected : function(hex) {
    if (this.currentHex) {
      this.currentHex.wire.material.color.setHex(0x000000);
    }
    this.currentHex = hex;
    this.currentHex.wire.material.color.setHex(0xffffff);
  }
}

world.critterControls = new CritterControls();
