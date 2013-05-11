var http = require('http');
var fs = require('fs');
var path = require('path');
var io = require('socket.io');

//The client connection: when a user connects this should be null, this
//should ensure that there is only one user connected
var client = null;
var port = 8125;
var hostAddr = '127.0.0.1';


var dgram = require("dgram");
var udpServer = dgram.createSocket("udp4");

udpServer.on("message", function (msg, rinfo) {
	//console.log("server got: " + msg + " from " +
	//rinfo.address + ":" + rinfo.port);
	try {
		// Suddenly there are some null-caracters at the end of my string.
		var parsed = JSON.parse(String(msg).trim().replace('\0', ''));
		//console.log(String(msg));
		if(parsed.type == "camera" && parsed.object_type == "robot") {
			parsed.type = "notify";
			var theDirection = (180/Math.PI)*Math.atan2(parsed.aref.y - parsed.position.y, parsed.aref.x - parsed.position.x);
			var message = {type: "notify", id:parsed.robot_id, pos:{x:parsed.position.x*(640/2), y:parsed.position.y*640/2}, working:false,direction:theDirection};

			
			parseAndSendToUI(message);
		}
	}
	catch(error) {
		console.log("error parsing packet: " + error);
	}
	
	
	//console.log(parsed.type);
	//console.log("Got udp packet");
});

udpServer.on("listening", function () {
	var address = udpServer.address();
	udpServer.setBroadcast(true);
	console.log("server listening " +
	address.address + ":" + address.port);
});

udpServer.on("error", function(error) {
	console.log(error);
	console.log(error.stack);
});


udpServer.bind(1337);



//These are the robots which should be discovered through XBee
//they should be objects({}) containing a name, the wireless
//strength, batteryStatus and their working status, i.e. are
//they doing some work or just fiddling about.
//Format robot === {name: robotNumber, wireless:wirelessStatus,
//battery:batteryStatus, working:doingWork}
var robots = [];

//Testing robots:
robots.push({name:'1', wireless:40, battery:70, working:false, pos:{x:400, y:20}, direction:0});
robots.push({name:'2', wireless:50, battery:100, working:false, pos:{x:40, y:0}, direction:0});
robots.push({name:'3', wireless:100, battery:10, working:true, pos:{x:200, y:200}, direction:0});
robots.push({name:'4', wireless:13, battery:0, working:false, pos:{x:100, y:300}, direction:0});
//robots.push({name:'5', wireless:0, battery:50, working:true, pos:{x:40, y:20}, direction:0});

if(process.argv.length > 2){
	hostAddr = process.argv[2];
	if (process.argv.length > 3){
		port = process.argv[3];
	}
}

var ioServer = io.listen(port + 1);
ioServer.set('log level', 1);

ioServer.on('connection', function (sock) {
	console.log('Getting a connection on websocket');
	if(client === null){
		console.log('A new client is connected to this websocket');
		client = sock;
		client.on('disconnect', onClientDisconnect);
		client.on('requestMove', onClientRequestMove);
		client.on('askDebug', onClientAskDebug);
		client.on('askInfo', onClientAskInfo);
		client.on('sendCommand', onClientSendCommand);
		robots.forEach(function (item) {
			client.emit('robotConnected', item.name, item.wireless,
				item.battery, item.working, item.pos,
				item.direction);
		});
	}else{
		console.log('There is already a client connected, refusing connection');
		sock.emit('connect_failed', 'Busy');
		sock.disconnect(true);
	}
});

//Parse a message coming from one of the robots and send that message
//to the UI, if the message is important the method relaying the information,
//e.g. sendNotification, must take care to save its data and then once the
//client is up resend
function parseAndSendToUI(data){
	switch(data.type){
		case 'notify':
			sendNotification(data);
			break;
		case 'debug_return':
			break;
		case 'info_return':
			break;
		case 'exception':
			break;
		case 'accept_move':
			break;
	}
}

//Low level function to emit data to the client, will return true if successful and
//false otherwise.
function sendToClient(emitSignal, data){
	if(client !== null){
		client.emit(emitSignal, data);
		return true;
	}else{
		return false;
	}
}

function sendNotification(data){
	sendToClient('notify', data);
	//console.log("Emmitted notify to client");
	//console.log(data.pos.x);
}

function onClientDisconnect () {
	console.log('Client disconnected from server websocket');
	client = null;
}

//Just a simple test to test the robot movements
var reqs;

function onClientRequestMove(data) {
	console.log('Client sent a request for movement');
	//--TEST below--
	reqs = data.data.request;
	sendToClient('acceptMoveRequest', {id:data.to, type:"accept_move"});
	var i = 0;
	var func = function (){
		var pos = reqs[i];
		i++;
		sendNotification({id:data.to,
			type:"notify",
			pos:{y:pos.y, x:pos.x},
			speed: 10,
			direction: 23,
			working: true});
		if(reqs.length > i){
			setTimeout(func, 300);
		}else{
			pos = reqs[reqs.length - 1];
			sendNotification({id:data.to,
			type:"notify",
			pos:{y:pos.y, x:pos.x},
			speed: 0,
			direction: 23,
			working: false});
		}
	};
	setTimeout(func, 300);
	//--TEST END --
	//TODO: Add communication with XBee
}

function onClientAskDebug(data){
	console.log('Client sent a request for debug');
	//TODO: Add communication with XBee
}

function onClientAskInfo(data){
	console.log('Client sent a request for information');
	//TODO: Add communication with XBee
}

function onClientSendCommand(data){
	console.log('Client sent a command packet');
	//TODO: Unpack and communicate with XBee

	//This line is only for testing/showing off purposes
	//client.emit('robotConnected', '6', 73, 34, true);
	
	var message = new Buffer(JSON.stringify(data));
	
	udpServer.send(message, 0, message.length, 1337, "255.255.255.255");
	console.log("Sent: " + message);

}

var server = http.createServer(function (request, response) {
	console.log('Got a request from: ' + request.connection.remoteAddress);
	var filepath = '../UI' + request.url;
	if (filepath == '../UI/')
		filepath = '../UI/index.htm';
	var contentType = 'text/html';
	console.log('User is requesting url: ' + filepath);
	var requestFiletype = path.extname(filepath);
	switch (requestFiletype){
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
		case '.png':
			contentType = 'image/png';
			break;
		case '.appcache':
			contentType = 'text/cache-manifest';
			break;
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
