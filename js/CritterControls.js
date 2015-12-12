/**
 * Controls for operating the side panel and moving critters
 * @param {Object} world
 */

CritterControls = function(world) {
  this.world = world;
  this.currentSelected = null;
  this.currentHovered = null;

  this.hex_colors = this.world.map.look_and_feel.getHexColors();
}

CritterControls.prototype = {
  // sets hex to be the current hovered hex 
  setHovered : function(hex) {
  	
    if(!world.selectable){
      return;
    }
  	
    //on same hex
    if (hex === this.currentHovered) {
      return;
    }

    if (this.currentHovered) {

      // highlighting selected
      if (this.currentHovered === this.currentSelected) {
        this.currentHovered.wire.material.color.setHex(this.hex_colors["selected"]);

        // leaving a selected hex
      } else {
        var wire = this.currentHovered.wire;
        wire.material.color.setHex(wire.origColor);
      }
    }

    this.currentHovered = hex;
    hex.wire.material.color.setHex(this.hex_colors["hover"]);
  },

/*
 *  updates the UI to show hex as being selected
 *  updates pane to show hex contents
 */
  setSelected : function(hex) {
  	
  	if(!world.selectable){return;}

    // unselect previous
    if (this.currentSelected) {
      var wire = this.currentSelected.wire;
      wire.material.color.setHex(wire.origColor);
    }

    // change selected and update panel
    this.currentSelected = hex;
    this.currentSelected.wire.material.color.setHex(this.hexSelectedColor);
    document.getElementById("current-hex").innerHTML = ("(" + this.currentSelected.location.c + "," + this.currentSelected.location.r + ")");
    hex.updateStats();

  }
}


