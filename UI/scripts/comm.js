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
		//TODO: Make an overlay or something to tell the user to reload
	});
	socket.on('disconnected', function () {
		setBannerText("Disconected from server", 0);
		gloabalSocket = null;
		//TODO: Make an overlay or something to tell the user to reload
	});
	socket.on('reconnecting', function () {
		setBannerText("Trying to reconnect to server", -1);
		gloabalSocket = null;
		//TODO: Make an overlay or something to tell the user to reload
	});
	socket.on('reconnect', function () {
		setBannerText("Connected successfully to server", 1000);
		gloabalSocket = socket;
	});
	socket.on('error', function () {
		setBannerText("The server connection had an accident", -1);
		globalSocket = null;
		//TODO: Make an overlay or something to tell the user to reload
	});
});

