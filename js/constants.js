var SERVER_URL = "/CritterWorld/";

var SESSION = "?session_id=0";
var SESSION_ID = "0";

// Login to the server
$(function () {
    $.ajax({
	url : SERVER_URL + "login",
	type: "POST",
	contentType: "application/json",
	data : JSON.stringify( {
	    "level": "admin",
	    "password": "admin"
	} )
    }).done(function (response) {
	SESSION = "?session_id=" + response.session_id;
	SESSION_ID = response.session_id;
	console.log(SESSION);
    });
});
