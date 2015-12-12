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
  	
    if(!world.hover_highlight){
      return;
    }
  	
    //on same hex
    if (hex === this.currentHovered) {
      return;
    }

    if (this.currentHovered) {

      // highlighting selected
      if (this.currentHovered === this.currentSelected) {
        this.currentHovered.highlightSelected();
 
        // leaving a selected hex
      } else {
       this.currentHovered.unhighlight(); 
 }
    }

    this.currentHovered = hex;
       
    this.currentHovered.highlight();
  },

/*
 *  updates the UI to show hex as being selected
 *  updates pane to show hex contents
 */
  setSelected : function(hex) {
  	
  	if(!world.selectable){return;}

    // unselect previous
    if (this.currentSelected) {
      this.currentSelected.unhighlight();
    }

    // change selected and update panel
    this.currentSelected = hex;
    this.currentSelected.highlightSelected();
    document.getElementById("current-hex").innerHTML = ("(" + this.currentSelected.location.c + "," + this.currentSelected.location.r + ")");
    hex.updateStats();

  }
}


