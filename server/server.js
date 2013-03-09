var http = require('http');
var fs = require('fs');
var path = require('path');
var io = require('socket.io');

//The client connection: when a user connects this should be null, this
//should ensure that there is only one user connected
var client = null;
var port = 8125;
var hostAddr = '127.0.0.1';

if(process.argv.length > 2){
	hostAddr = process.argv[2];
	if (process.argv.length > 3){
		port = process.argv[3];
	}
}

var ioServer = io.listen(port + 1);

ioServer.on('connection', function (sock) {
	console.log('Getting a connection on websocket');
	if(client === null){
		console.log('A new client is connected to this websocket');
		client = sock;
		client.on('disconnect', onClientDisconnect);
		//TODO: Add the necessary message functions here
	}else{
		console.log('There is already a client connected, refusing connection');
		sock.disconnect();
	}
});

function onClientDisconnect () {
	console.log('Client disconnected from server websocket');
	client = null;
}

var server = http.createServer(function (request, response) {
	console.log('Got a request from: ' + request.connection.remoteAddress);
	var filepath = '../UI' + request.url;
	if (filepath == '../UI/')
		filepath = '../UI/index.htm';
	var contentType = 'text/html';
	console.log('User is requesting url: ' + filepath);
	if(client === null){
		console.log('We can accomodate the user, no other connections');
		var requestFiletype = path.extname(filepath);
		switch (requestFiletype){
			case '.js':
				contentType = 'text/javascript';
				break;
			case '.css':
				contentType = 'text/css';
				break;
		}
	}else{
		console.log('We can\' accomodate the user, client: ' + client + 
			' is already connected');
		console.log('Serving our appology site');
		contentType = 'text/html';
		filepath = '../UI/sorry.htm';
	}
	fs.readFile(filepath, function(error, content) {
		if (error) {
			console.log('Could not read file: ' + filepath +
				' returning error 500 to user');
			response.writeHead(500);
			response.end();
		}
		else {
			console.log('Read file: ' + filepath + ' returning it now');
			response.writeHead(200, { 'Content-Type': contentType });
			response.end(content, 'utf-8');
		}
	});
});
server.on('error', function (err) {
	console.log('Server threw an error');
	switch (err.code){
		case 'EADDRNOTAVAIL':
			console.log('The address was not available.' +
				' Please try with a different address');
			break;
		case 'EADDRINUSE':
			console.log('The address is already in use. ' +
				'This may be because another program is using ' +
				'the address or if this program was running, ' +
				'it may not hav released the address yet, if ' +
				'this is the case just wait a minutt and try again');
			break;
		default:
			console.log('Could not recognize the error.\n' + 
				err);
			break;
	}
});

server.listen(port, hostAddr, 511, function () {
	console.log('Server started on address: ' + hostAddr + ':' + port);
});
