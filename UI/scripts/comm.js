var globalSocket = null;

$(document).ready(function(){
	var socket = io.connect(location.hostname + ':' + (parseInt(location.port) + 1));
	var banner = $("#banner");
	banner.text("Connecting to server");
	socket.on('connect', function () {
		banner.text("Connected to server");
		globalSocket = socket;
		clearHeader(1000);
	});
	socket.on('connect_failed', function () {
		banner.text("Could not connect to server");
		globalSocket = null;
		//TODO: Make an overlay or something to tell the user to reload
	});
	socket.on('disconnected', function () {
		banner.text("Disconected from server");
		gloabalSocket = null;
		//TODO: Make an overlay or something to tell the user to reload
	});
	socket.on('reconnecting', function () {
		banner.text("Trying to reconnect to server");
		gloabalSocket = null;
		//TODO: Make an overlay or something to tell the user to reload
	});
	socket.on('reconnect', function () {
		banner.text("Connected successfully to server");
		gloabalSocket = socket;
		clearHeader(1000);
	});
	socket.on('error', function () {
		banner.text("The server connection had an accident");
		globalSocket = null;
		//TODO: Make an overlay or something to tell the user to reload
	});
});

function clearHeader (timeout) {
	setTimeout(function () {
		$("#banner").text("Robots");
	}, timeout);
}
