Function.prototype.bindScope = function(scope) {
  var _function = this;
  return function() {
    return _function.apply(scope, arguments);
  }
}
var KEYS = {
  ENTER : 65,

  //WASD
  LEFT : 97,
  UP : 119,
  RIGHT : 100,
  DOWN : 115,

  C : 99,
  R: 114,
  
  //ARROWS
  // LEFT : 37,
  // UP : 38,
  // RIGHT : 39,
  // DOWN : 40,
  ROTATE : 65,
  ZOOM : 83,
  PAN : 68
};
