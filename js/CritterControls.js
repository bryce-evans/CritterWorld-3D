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

  $(document).keypress( function(event) {

    if (this.currentSelected) {

      // add objects
      if (this.currentSelected.type === 0) {
        // add critter
        if (event.which === KEYS.C) {
          this.currentSelected.addCritter();
          world.data.critterCount += 1;
          this.currentSelected.updateStats();
          world.updateStats();

          // add rock
        } else if (event.which === KEYS.R) {
          this.currentSelected.addRock();
        }
        // move
      } else {
        if (this.currentSelected.type === 2) {
          var moved = false;

          if (event.which === KEYS.UP) {
            moved = true;
            this.currentSelected.critter.moveForward();
          } else if (event.which === KEYS.DOWN) {
            moved = true;
            this.currentSelected.critter.moveBackward();
          } else if (event.which === KEYS.RIGHT) {
            moved = true;
            this.currentSelected.critter.turnRight();
          } else if (event.which === KEYS.LEFT) {
            moved = true;
            this.currentSelected.critter.turnLeft();
          }
          if (moved) {
            world.turnOccurring = true;
            world.data.timeStep += 1;
            world.updateStats();
          }

        }
      }

    }
  }.bind(this));

}

CritterControls.prototype = {

  setHovered : function(hex) {
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

  setSelected : function(hex) {

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


