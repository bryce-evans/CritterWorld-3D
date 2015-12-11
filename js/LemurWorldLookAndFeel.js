LemurWorldLookAndFeel = function() {
  WorldLookAndFeel.call(this);
  
  this.dir = "lemur/";
  
  this.scene_objs = ["ground", "water"];
  

}
LemurWorldLookAndFeel.prototype = Object.create(WorldLookAndFeel.prototype);
LemurWorldLookAndFeel.prototype.constructor = LemurWorldLookAndFeel;

LemurWorldLookAndFeel.prototype.getHexModel = function(xy_pos, radius, buffer) {
  return WorldLookAndFeel.prototype.getHexModel(xy_pos, 0x8bf600, radius, buffer);
}
