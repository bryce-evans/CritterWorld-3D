// from CritterControls.js
// TODO: integrate into static version

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