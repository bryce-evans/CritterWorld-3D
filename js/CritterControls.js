/**
 * Controls for operating the side panel and moving critters
 * @param {Object} world
 */

CritterControls = function(world) {
  this.world = world;
  this.currentSelected = null;
  this.currentHovered = null;

  this.hexHoverColor = 0xffffff;
  this.hexSelectedColor = 0xffbe10;
  this.hexBaseColor = this.world.map.hexColor;

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
        this.currentHovered.wire.material.color.setHex(this.hexSelectedColor);

        // leaving a selected hex
      } else {
        this.currentHovered.wire.material.color.setHex(this.hexBaseColor);
      }
    }

    this.currentHovered = hex;
    hex.wire.material.color.setHex(this.hexHoverColor);
  },

/*
 *  updates the UI to show hex as being selected
 *  updates pane to show hex contents
 */
  setSelected : function(hex) {
  	
  	if(!world.selectable){return;}

    // unselect previous
    if (this.currentSelected) {
      this.currentSelected.wire.material.color.setHex(this.hexBaseColor);
    }

    // change selected and update panel
    this.currentSelected = hex;
    this.currentSelected.wire.material.color.setHex(this.hexSelectedColor);
    document.getElementById("current-hex").innerHTML = ("(" + this.currentSelected.location.c + "," + this.currentSelected.location.r + ")");
    hex.updateStats();

  }
}


