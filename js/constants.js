var SERVER_URL = "http://localhost:8080/CritterWorld/";

var SESSION = "?session_id=0"

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
	console.log(SESSION);
    });
});
