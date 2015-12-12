LemurWorldLookAndFeel = function() {
  WorldLookAndFeel.call(this);
  
  this.dir = "lemur/";
  
  this.scene_objs = ["ground", "water"];
  this.hex_colors.selected = 0xffbe10;  

}
LemurWorldLookAndFeel.prototype = Object.create(WorldLookAndFeel.prototype);
LemurWorldLookAndFeel.prototype.constructor = LemurWorldLookAndFeel;

// all hexes same color
LemurWorldLookAndFeel.prototype.getHexWire = function(xy_pos, radius, buffer) {
  return WorldLookAndFeel.prototype.getHexWire(xy_pos, 0x8bf600, radius, buffer);
}
