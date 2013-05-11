var globalSocket = null;
//Variable signifying if the socket is trying to connect, use this in conjunction
//with globalSocket to decide which state the comm channel is in, if connecting the
//socket should be null, if socket is connected, i.e. not null, connecting should
//be false
var connecting = false;
var retries = 3;
var infoRequests = [];

$(document).ready(function(){
	//Connect to the server using socket.io once the page is loaded
	var socket = io.connect(location.hostname + ':' + (parseInt(location.port) + 1));
	connecting = true;
	//Setting to true, because we are trying to connect, but
	//are not yet connected
	socket.on('connect', function () {
		globalSocket = socket;
		setBannerText("Connected to Server", 1000);
		createSetupDiv();
		connecting = false;
		 $( "#slider" ).slider({
        value:0,
        min: 0,
        max: 360,
        step: 10,
        slide: function( event, ui ) {
                           //Its setting the slider value to the element with id "amount"
          $( "#formationRotation" ).text( ui.value );
			data = {"type": "command", "command":"update", "formationrotation": parseInt(ui.value)};
			sendCommand(data, function(status){});
        }
    });
	
	});
	socket.on('connect_failed', function () {
		setBannerText("Could not connect to server", -1);
		globalSocket = null;
		alert('The connection to the server could not be established. ' +
			'This could mean that the server is busy with someone ' +
			'else or that the server could not be reached. Try ' +
			'to reload the page and if the problem persists, try ' +
			'to restart the server');
		connecting = false;
	});
	socket.on('disconnected', function () {
		setBannerText("Disconected from server", -1);
		globalSocket = null;
		alert('The connection was disrupted, if the page does not ' +
			'try to reconnect try and reload the page, if that does ' +
			'not help restart the server');
		connecting = false;
	});
	socket.on('reconnecting', function () {
		setBannerText("Trying to reconnect to server", -1);
		globalSocket = null;
		alert('The page is trying to reconnect to the server, during ' +
			'this time the page can not be used and all commands ' +
			'will timeout. If the page is not reconnected within ' +
			'a minute or so check your network connection and try ' +
			'to reload the page');
		connecting = true;
	});
	socket.on('reconnect', function () {
		setBannerText("Reconnected successfully to server", 1000);
		globalSocket = socket;
		connecting = false;
	});
	socket.on('error', function () {
		setBannerText("The server connection had an accident", -1);
		globalSocket = null;
		alert('Some major mishap just happened, if this is the first time ' +
			'you see this message try and reload the page and pretend ' +
			'that you did not see this, if however this has happened ' +
			'multiple times run around with your arms flailing and yell ' +
			'"THE WORLD IS ABOUT TO END!"');
		connecting = false;
	});

	//Below are the Robot specific communications
	socket.on('notify', notification);
	socket.on('debug', debug);
	socket.on('info', info);
	socket.on('exception', exception);
	socket.on('acceptMoveRequest', moveRequestAccepted);
	//The robot connected event is special because it will be some XBee magic
	//to have this emit from server once server sees a robot through XBee
	socket.on('robotConnected', function (id, wire, batt, working, pos, direc){
		
		createRobotDiv(id, wire, batt, working);
		drawRobot(id, pos.x, pos.y, direc);
		
	});
	//To add more of these support has to be added in server.js to emit more
	//then just add more of the socket.on methods referencing functions
	//which support the same variables as the emit function in server.js
});

function notification(data){
	//For the moment just move the robot since a notification message
	//does not contain more info
	drawRobot(data.id, data.pos.x, data.pos.y, data.direction);
	updateRobotWorking(data.id, data.working);


}

function debug(data){
	//Just report to the console the debug elements
	console.log('Debug info from: ' + data.id);
	for(var item in data.info){
		console.log(item);
	}
}

function info(data){
	var pos = -1;
	for(var i = infoRequests.length; i >= 0; i++){
		if ( data.id === infoRequests[i].to ) {
			pos = i;
			break;
		}
	}
	if(pos >= 0){
		var request = infoRequests[pos].data.wanted;
		infoRequests.remove(pos);
		for(var i = 0; i < request.length; i++){
			handleInfo(request[i], data.info[i], data.id);
		}
	}else{
		//Could not find the corresponding askInfo message
		console.log("Got a strange info message which was not asked for");
		console.log('From: ' + data.id);
		console.log(data);
	}
}

//TODO: Finish this methods to update the correct places
function handleInfo(infoElement, value, robot){
	//To extend when new info is available extend the switch below
	//and add the new functionality
	switch(infoElement){
		case 'battery_status':
			updateRobotBattery(robot, value);
			break;
		case 'pos':
			break;
		case 'surroundings':
			break;
		case 'wireless_signal':
			updateRobotWireless(robot, value);
			break;
		case 'working':
			break;
	}
}

function exception(data){
	console.log('Robot: ' + data.id + ', threw an exception');
	console.log('Exception name: ' + data.exception_type.exception_name);
	console.log('Description: ' + data.exception_type.exception_desc);
	console.log('Call stack:\n' + data.exception_type.debug_info);
}

function moveRequestAccepted(data){
	//Since it accepted our order we set it to be working
	//this can be overridden by the askInfo call
	updateRobotWorking(data.id, true);
}

//Functions regarding communication with backend
function sendMovementReq(data, callback){
	__trySend(data, callback, 0, 'requestMove');
}

function sendAskDebug(data, callback){
	__trySend(data, callback, 0, 'askDebug');
}

function sendAskInfo(data, callback){
	__trySend(data, callback, 0, 'askInfo');
}

function sendCommand(data, callback){
	__trySend(data, callback, 0, 'sendCommand');
}

//The callback function must be able to take a boolean true/false, the meaning of
//this is that if true the message was sent without a problem and the function
//can proceed and do its thing, e.g. remove sub menus because the information
//was sent to the backend server
function __trySend(data, callback, times, emitText){
	if (times > retries){
		//We have tried so many times that the connection is most
		//likely dead, user should have gotten a message from above
		callback(false);
	}else{
		if (globalSocket !== null){
			//The socket is ready and we can transmit data
			globalSocket.emit(emitText, data);
			infoRequests.push(data);
			callback(true);
		}else{
			//The socket is null and we need to either try again or
			//give up
			if (connecting === true){
				//The connection is trying to reconnect
				//we should therefor try and resend slightly
				//later
				setTimeout(function () {
					__trySend(data, callback, times+1, emitText);
				}, times*100);
			}else{
				//There is no effort to try and reconnect the
				//socket so just return false right away.
				//This might also be called if a reconnect
				//failed
				callback(false);
			}
		}
	}
}
