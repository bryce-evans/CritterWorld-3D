/*
 *  check if file is invalid -> unneeded
 */

/*
 * BEGIN BUTTON LISTENERS
 */

var SERVER_URL = "http://localhost:8989/CritterWorld/";

$(document).ready(function() {
  var active_pane = "";
  var active_tab = "";

  var current_option = "";
  $("#world_menu").hide();
  $("#critter_menu").hide();

  $("#multiplayer").click(function() {
    $("#world_menu").show();
    active_pane = "world";
    active_tab = "defaults";
  });

  $(document).keydown(function(e) {
    console.log(e);
    var code = e.keyCode || e.which;
    console.log(code);
    if (code == 27) {

      if (active_pane === "world") {
        $("#world_menu").hide();
      } else {
        console.log("I don't know what I'm trying to close");
      }
    }
  });

  $("#world_defaults_button").click(function() {
    if (active_tab !== "defaults") {
      $("#world_defaults_button").addClass("selected");
      $("#world_uploader_button").removeClass("selected");
      active_tab = "defaults";
      $("#world_defaults").show();
      $("#world_uploader").hide();
    }
  });

  $("#world_uploader_button").click(function() {
    if (active_tab !== "uploader") {
      $("#world_uploader_button").addClass("selected");
      $("#world_defaults_button").removeClass("selected");
      active_tab = "uploader";
      $("#world_defaults").hide();
      $("#world_uploader").show();
    }
  });

  $("#world_defaults li div").click(function(e) {
    console.log(e);

    $(e.currentTarget).addClass("selected");
    $(current_option).removeClass("selected");
    current_option = e.currentTarget;
  });

  $("#choose_world").click(function(e) {
    new_world = current_option.innerText;
    if (new_world === "Empty World") {
      $.ajax({
        url : SERVER_URL + "world",
        type : "POST",
        data : JSON.stringify({
          "definition" : ""
        }),
        processData : false,
        dataType : 'json',
        statusCode : {
          200 : function(response) {
            alert('success! 200 no fn running');
          },
          201 : function(response) {
            $("#start_page").hide();
            $("#game_page").show();
            init_game_server({});
          },
          400 : function(response) {
            alert('<span style="color:Red;">Error While Saving Outage Entry Please Check</span>', function() {
            });
          },
          404 : function(response) {
            alert('1');
            bootbox.alert('<span style="color:Red;">Server Not Responding</span>', function() {
            });
          },
          500 : function(response) {
            alert('server error');
          }
        }
      });
    } else if (new_world === "Random World") {
      $.ajax({
        url : SERVER_URL + "world",
        type : "POST",
        processData : false,
        dataType : 'json',
        statusCode : {
          200 : function(response) {
            alert('success! 200- no fn running');
          },
          201 : function(response) {
            $.ajax({
              url : SERVER_URL + "world",
              type : "GET",
              processData : false,
              dataType : 'json',
              statusCode : {
                200 : function(response) {
                  $("#start_page").hide();
                  $("#game_page").show();
                  init_game_server(response);
                }
              }
            });

          },
          400 : function(response) {
            alert('<span style="color:Red;">Error While Saving Outage Entry Please Check</span>', function() {
            });
          },
          404 : function(response) {
            alert('1');
            bootbox.alert('<span style="color:Red;">Server Not Responding</span>', function() {
            });
          },
          500 : function(response) {
            alert('server error');
          }
        }
      });
    }
  });

  /*
   * ****************************** BEGIN SERVER TESTS
   */

  $("#run_world").click(function() {
    $.post(SERVER_URL + "run?rate=2.0", function() {
      alert("success");
    });
  });

  $("#stop_world").click(function() {
    $.post(SERVER_URL + "run?rate=0", function() {
      alert("success");
    });
  });

  //attacker1.crit is server side - INVALID
  // $("#run_world").click(function() {
  // $.post(SERVER_URL + "world", data = {
  // "definition" : "rock 5 2\nrock 6 4\ncritter attacker1.crit 6 2 0\n"
  // }, function() {
  // alert("success");
  // });
  // });

  var since = 1;
  $("#get_world").click(function() {
    var response = $.ajax({
      url : SERVER_URL + "world?update_since=" + since,
      type : "GET",
      dataType : "json",
      crossDomain : true,

    }).done(function(data, status) {
      console.log(data);
      //alert("Data: " + data + "\nStatus: " + status);
    }).fail(function(error, status) {
      console.log("error");
      console.log(error);
      console.log(status);
      alert("error");
    });
  });

  $("#load_world").click(function() {
    $.post(SERVER_URL + "step?count=1", function() {
      alert("success");
    });
  });

  $("#step_world").click(function() {
    $.post(SERVER_URL + "step?count=1", function() {
      alert("success");
    });
  });

  $("#get_critter").click(function() {
    var jqxhr = $.getJSON(SERVER_URL + "critters", function(data) {
      console.log(data);
    })
  });

  $("#delete_critter").click(function() {
    var jqxhr = $.ajax({
      url : SERVER_URL + "critters/" + document.getElementById('input_row').value,
      type : "DELETE"
    }).done(function(data) {
      console.log(data);
    })
  });

  $("#get_critters").click(function() {
    var jqxhr = $.getJSON(SERVER_URL + "critters", function(data) {
      console.log(data);
    })
  });

});

///////////////////////////////////// FILE READING

function readWorldFile(opt_startByte, opt_stopByte) {

  var files = document.getElementById('world_upload').files;
  if (!files.length) {
    alert('Please select a file!');
    return;
  }

  var file = files[0];
  var start = parseInt(opt_startByte) || 0;
  var stop = parseInt(opt_stopByte) || file.size - 1;

  var reader = new FileReader();

  // If we use onloadend, we need to check the readyState.
  reader.onloadend = function(evt) {
    send_data = {
      "definition" : evt.target.result
    };
    console.log(send_data);

    $.ajax({
      url : SERVER_URL + "world",
      type : "POST",
      data : JSON.stringify(send_data),
      processData : false,
      dataType : 'json',
      statusCode : {
        200 : function(response) {
          alert('success!');
        },
        201 : function(response) {
          alert("success!")
        },
        400 : function(response) {
          alert('<span style="color:Red;">Error While Saving Outage Entry Please Check</span>', function() {
          });
        },
        404 : function(response) {
          alert('1');
          bootbox.alert('<span style="color:Red;">Server Not Responding</span>', function() {
          });
        },
        500 : function(response) {
          alert('server error');
        }
      }
    });
    document.getElementById('byte_range').textContent = ['Read bytes: ', start + 1, ' - ', stop + 1, ' of ', file.size, ' byte file'].join('');

  }
  var blob = file.slice(start, stop + 1);
  reader.readAsBinaryString(blob);
}

function readCritterFile(opt_startByte, opt_stopByte) {

  var files = document.getElementById('critter_upload').files;
  if (!files.length) {
    alert('Please select a file!');
    return;
  }

  var file = files[0];
  var start = parseInt(opt_startByte) || 0;
  var stop = parseInt(opt_stopByte) || file.size - 1;

  var reader = new FileReader();

  // If we use onloadend, we need to check the readyState.
  reader.onloadend = function(evt) {
    console.log(evt);
    if (evt.target.readyState == FileReader.DONE) {// DONE == 2
      document.getElementById('byte_content').textContent = evt.target.result;
      var prog = (evt.target.result);
      //console.log(prog);

      var myString = prog;
      // var myRegexp = /[a-z]+: ([0-9]+)/g;//[\n]*(.)+");
      var lines = myString.split('\n');
      var mems = [];
      var program = "";
      for (var i in lines) {
        var line = lines[i];
        var match = /[a-z]+: ([0-9]+)/g.exec(line);
        if (match === null) {
          // if null, then we are matching a program
          program += line + '\n';
        } else {
          mems.push(parseInt(match[1]));
        }
      }

      var fu1 = document.getElementById("critter_upload");
      specie_name = (fu1.value.split(/(\\|\/)/g).pop().split(".")[0]);

      // console.log(match);
      // for ( i = 0; i < match.length; i++) {
      // console.log(i + ": " + match[i]);
      // }
      send_data = {
        "program" : program,
        "mem" : mems,
        "species_id" : specie_name,
        "positions" : [{
          "row" : document.getElementById('input_row').value,
          "col" : document.getElementById('input_col').value
        }]
      };
      console.log(send_data);

      $.ajax({
        url : SERVER_URL + "critters",
        type : "POST",
        data : JSON.stringify(send_data),
        processData : false,
        dataType : 'json'
      }).done(function() {
        alert("success");
      }).fail(function() {
        alert("failed");
      });
      document.getElementById('byte_range').textContent = ['Read bytes: ', start + 1, ' - ', stop + 1, ' of ', file.size, ' byte file'].join('');
    }
  };

  var blob = file.slice(start, stop + 1);
  reader.readAsBinaryString(blob);
}


document.querySelector('.readCritterButtons').addEventListener('click', function(evt) {
  if (evt.target.tagName.toLowerCase() == 'button') {
    var startByte = evt.target.getAttribute('data-startbyte');
    var endByte = evt.target.getAttribute('data-endbyte');
    readCritterFile(startByte, endByte);
  }
}, false);

document.querySelector('.readWorldButtons').addEventListener('click', function(evt) {
  if (evt.target.tagName.toLowerCase() == 'button') {
    var startByte = evt.target.getAttribute('data-startbyte');
    var endByte = evt.target.getAttribute('data-endbyte');
    readWorldFile(startByte, endByte);
  }
}, false);

// $(document).bind('dragover', function (e) {
// var dropZone = $('#drop_zone'),
// timeout = window.dropZoneTimeout;
// if (!timeout) {
// dropZone.addClass('in');
// } else {
// clearTimeout(timeout);
// }
// var found = false,
// node = e.target;
// do {
// if (node === dropZone[0]) {
// found = true;
// break;
// }
// node = node.parentNode;
// } while (node != null);
// if (found) {
// dropZone.addClass('hover');
// } else {
// dropZone.removeClass('hover');
// }
// window.dropZoneTimeout = setTimeout(function () {
// window.dropZoneTimeout = null;
// dropZone.removeClass('in hover');
// }, 100);
// });

/////////////////////////////////////////////
function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files;
  // FileList object.

  // files is a FileList of File objects. List some properties.
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ', f.size, ' bytes, last modified: ', f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a', '</li>');
  }
  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy';
  // Explicitly show this is a copy.
}

// Setup the dnd listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);
