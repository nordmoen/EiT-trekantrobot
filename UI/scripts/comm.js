var globalSocket = null;

$(document).ready(function(){
	var socket = io.connect(location.hostname + ':' + (parseInt(location.port) + 1));
	socket.on('connect', function () {
		globalSocket = socket;
		setBannerText("Connected to Server", 1000);
	});
	socket.on('connect_failed', function () {
		setBannerText("Could not connect to server", -1);
		globalSocket = null;
		alert('The connection to the server could not be established. ' +
			'This could mean that the server is busy with someone ' +
			'else or that the server could not be reached. Try ' +
			'to reload the page and if the problem persists, try ' +
			'to restart the server');
	});
	socket.on('disconnected', function () {
		setBannerText("Disconected from server", -1);
		globalSocket = null;
		alert('The connection was disrupted, if the page does not ' +
			'try to reconnect try and reload the page, if that does ' +
			'not help restart the server');
	});
	socket.on('reconnecting', function () {
		setBannerText("Trying to reconnect to server", -1);
		globalSocket = null;
		alert('The page is trying to reconnect to the server, during ' +
			'this time the page can not be used and all commands ' +
			'will timeout. If the page is not reconnected within ' +
			'a minute or so check your network connection and try ' +
			'to reload the page');
	});
	socket.on('reconnect', function () {
		setBannerText("Reconnected successfully to server", 1000);
		globalSocket = socket;
	});
	socket.on('error', function () {
		setBannerText("The server connection had an accident", -1);
		globalSocket = null;
		alert('Some major mishap just happened, if this is the first time ' +
			'you see this message try and reload the page and pretend ' +
			'that you did not see this, if however this has happened ' +
			'multiple times run around with your arms flailing and yell ' +
			'"THE WORLD IS ABOUT TO END!"');
	});
});
