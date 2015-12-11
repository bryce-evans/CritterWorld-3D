$(document).ready(function() {

  newWorld = function(def) {
    var data = (def != undefined) ? {
      definition : def
    } : undefined;
    $.ajax({
      url : SERVER_URL + "world" + SESSION,
      type : "POST",
      data : data,
    }).done(function(res) {

    });
  }
  newEmptyWorld = function() {
    newWorld("");
  }
  newRandomWorld = function() {
    newWorld();
  }
  runWorld = function(rate, callback) {
    $.post(SERVER_URL + "run?rate=" + rate + SESSION, function() {
    });
  }
  getWorld = function(s, a) {

    if ( typeof (s) == "number") {
      var in_since = s;
    } else if ( typeof (a) == "number") {
      var in_since = a;
    }

    var since = in_since || 0;
    var async = a || false;

    var response = $.ajax({
      async : async,
      url : SERVER_URL + "world" + SESSION,
      type : "POST",
      data : JSON.stringify({
        update_since : since
      }),
      dataType : "json",
      crossDomain : true,

    }).done(function(data, status) {
      if (async)
        console.log(data);
      //alert("Data: " + data + "\nStatus: " + status);
    }).fail(function(error, status) {
      console.log("error");
      console.log(error);
      console.log(status);
      alert("error");
    });
    if (!async)
      return JSON.parse(response.responseText);
  }
  step = function() {
    $.post(SERVER_URL + "step?count=1" + SESSION, function() {
      alert("success");
    });
  }
  deleteCritter = function(id, async) {
    var response = $.ajax({
      url : SERVER_URL + "critters/" + document.getElementById('input_row').value + SESSION,
      type : "DELETE"
    }).done(function(data) {
      console.log(data);
    });
    if (!async)
      return JSON.parse(response.responseText);
  }
}); 
