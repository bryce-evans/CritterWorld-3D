function init_game_server(data) {
  // add world and create map (from World, Map. js)
  world = new World(data);
  world.map = new Map(world);

  world.map.calculateSize();
  // world.lookAt(new THREE.Vector3(world.map.center.x / 2, 0, world.map.center.y);
  world.camera.lookAt(new THREE.Vector3(world.map.center.x / 2, 0, world.map.center.y));
  world.lookAt = (new THREE.Vector3(world.map.center.x / 2, 0, world.map.center.y));
  world.camera.position.copy(new THREE.Vector3(world.map.center.x / 2, 250, world.map.center.y));

  // Add mouse controls (from MouseControls.js)
  THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);

  // Add controls for side pane (from CritterControls.js)
  world.critterControls = new CritterControls(world);

  if (!Detector.webgl)
    Detector.addGetWebGLMessage();
  console.log(data);

  // add Hex Grid to World
  for (var c = 0; c < world.COLUMNS; c++) {
    for (var r = Math.ceil(c / 2); 2 * r < c + (2 * world.ROWS - world.COLUMNS) + (world.COLUMNS % 2 == 0 && c % 2 != 0 ? 1 : 0); r++) {
      new Hex(c, r);
    }
  }

  world.map.update(data.state);
  init();

  window.start = function() {
    world.interval_id = window.setInterval(function() {
      $.post(SERVER_URL + "step?count=1" + SESSION);
      world.updateToServer();
    }, 1000);
  }

  window.stop = function() {
    window.clearInterval(world.interval_id);
  }

  var throttle_time = 200; // Minimum time between requests in ms.
  var last_run = Date.now() + throttle_time;
  var full_update_needed = false;
  
  function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last,
        deferTimer;
    return function () {
      var context = scope || this;

      var now = +new Date,
          args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }

  window.updateWorld = throttle(function() {
    var world_str = "";
    if (full_update_needed) {
      world_str = "world?";
      full_update_needed = false;
    } else {
      world_str = "world?update_since=" + world.t + "&";
    }
    $.ajax({
      url : SERVER_URL + world_str + "heavy_filter=CSPolls&session_id=" + SESSION_ID,
      // url : SERVER_URL + "world" + SESSION,
      type : "GET",
      processData : false,
      dataType : 'json',
      statusCode : {
        200 : function(response) {
          world.data.timeStep = response.current_timestep;
          world.data.population = response.population;
          world.t = response.current_version_number;
          var updates = response.state;
          world.map.update(updates);

          var this_run = Date.now();
          var run_time = this_run - last_run;
          last_run = this_run;
          if (run_time > throttle_time) {
            // The request was slow, request immediately
            // console.error("slow");
            updateWorld();
          } else {
            // console.error("fast");
            window.setTimeout(updateWorld, throttle_time - run_time);
          }
        }
      },
      error: function () {
        last_run = Date.now();
        window.setTimeout(updateWorld, throttle_time);
      }
    });
  }, throttle_time);

  window.setInterval(function() {
    full_update_needed = true;
    updateWorld();
  }, 5000);
  // window.setTimeout(updateWorld, 200);
  updateWorld();

}
