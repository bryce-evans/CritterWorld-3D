CritterControls = function(world) {
  this.world = world;
  this.currentSelected = null;
  this.currentHovered = null;

  this.hexHoverColor = 0xffffff;
  this.hexSelectedColor = 0xffbe10;
  this.hexBaseColor = this.world.scene.map.hexColor;

  $(document).keypress( function(event) {
    if (event.which == 97 && this.currentSelected && this.currentSelected.type === 0) {
      this.currentSelected.addCritter();
      this.updateStats(this.currentSelected);
    }
  }.bind(this));
}

CritterControls.prototype = {

  setHovered : function(hex) {
    //on same hex
    if (hex === this.currentHovered) {
      return;
    }
    // leaving a selected hex
    if (this.currentHovered) {
      if (this.currentSelected === this.currentHovered) {
        this.currentHovered.wire.material.color.setHex(this.hexSelectedColor);
      } else {
        this.currentHovered.wire.material.color.setHex(this.hexBaseColor);
      }
    }
    this.currentHovered = hex;
    hex.wire.material.color.setHex(this.hexHoverColor);
  },

  setSelected : function(hex) {
    if (this.currentSelected) {
      this.currentSelected.wire.material.color.setHex(this.hexBaseColor);
    }
    this.currentSelected = hex;
    this.currentSelected.wire.material.color.setHex(this.hexSelectedColor);
    document.getElementById("current-hex").innerHTML = ("(" + this.currentSelected.location.c + "," + this.currentSelected.location.r + ")");

    this.updateStats(hex);

  },

  updateStats : function(hex) {
    if (hex.type === 0) {
      document.getElementById("current-hex-type").innerHTML = (" ");
    } else if (hex.type === 1) {
      document.getElementById("current-hex-type").innerHTML = ("Rock");
    } else if (hex.type === 2) {
      document.getElementById("current-hex-type").innerHTML = ("Critter");
    }
  }
}

world.critterControls = new CritterControls(world);
