
function robotClick(event){
	if(this.classList.contains("selected") && this.classList.contains("robot")){
		removeMenu(this, true);
	} else {
		addMenu(this);
	}
}

function innerClick(event){
	if(this.id==="close"){
		removeMenu(this, true);
	}else if(this.classList.contains("closeMenu")){
		removeMenu(this, false);
	}else if(!this.classList.contains("selected")){
		addMenu(this)
	}
	event.stopPropagation();
}

function actionClick(event){
	var caller = this;
	var robot = getRobotId(this);
	var dataOptions = {};

	var data={
		to: robot,
		data: {
			type: "command",
			command: this.id,
			options: dataOptions
		}
	};
	sendCommand(data, function(bool){
		if(bool){
			removeMenu(caller, false);
		} else {
			alert("You have been eaten by a grue.\n"+
			"Lost connection to the server"); //This error should never be displayed.
		}
	});
	event.stopPropagation();
}



function addMenu(elm){
    if(elm.classList.contains("robot")){
    	$(".selected").each(function(index, element) {
    		removeMenu(element, false);
    	});
    }
    elm.classList.add("selected");
    setBannerText(elm.title, -1);
    var menuDiv = document.createElement("div");
    menuDiv.id = "menuDiv";
    menuDiv.classList.add("innerClick");
    menuDiv.innerHTML = "<hr />";
    elm.appendChild(menuDiv);
    var children = createMenuDiv(elm);
    for( var i=0; i < children.length; i++){
        menuDiv.appendChild(children[i]);
    }

    $("#menuDiv").effect( "slide", {direction:"right"}, 250, function () {} );
}


function removeMenu(elm, reset){
	if(elm.classList.contains("robot")){
		elm.removeChild(elm.lastChild);
		elm.classList.remove("selected");
	} else{
		var par1 = elm.parentNode;
		var par2;
		if(par2 = par1.parentNode){
			par2.removeChild(par1);
			par2.classList.remove("selected");
			setBannerText(par2.parentNode.parentNode.title, -1);
		}
	}
	if(reset){
		resetBanner();
	}
	clearDrawLine();
}

function createMenuDiv(parent){
	if (parent.classList.contains("robot")){
		return mainMenu(parent);
	}
	if (parent.id==="drawPath"){
		return drawMenu(parent);
	}
	if (parent.id==="formation"){
		return formMenu(parent);
	}
	if (parent.id==="dance"){
		return danceMenu(parent);
	}
	if (parent.id==="waypoint"){
		return waypointMenu(parent);
	}
}

function createRobotDiv (number, wirelessSignal, batteryStatus, working) {
	if(document.getElementById("r"+number)!==null){
		return false;
	}
	var rDiv = document.createElement("div");
	rDiv.classList.add("robot");
	rDiv.classList.add("clickable");
	rDiv.id = "r" + number;
	rDiv.title = "Robot " + number;
	rDiv.innerHTML=rDiv.title + "<br />";
	rDiv.onclick=robotClick

	var batt = document.createElement("img");
	batt.src=createBatteryLoc(batteryStatus);
	batt.alt="Battery status " + batteryStatus+"%";
	batt.title=batt.alt;
	batt.classList.add("battIcon");
	batt.id="r"+number+"batt";
	rDiv.appendChild(batt);

	var wifi = document.createElement("img");
	wifi.src=createWirelessLoc(wirelessSignal);
	wifi.alt="Wireless signal " + wirelessSignal+"%";
	wifi.title=wifi.alt;
	wifi.classList.add("wifiIcon");
	wifi.id="r"+number+"wifi";
	rDiv.appendChild(wifi);

	var work = document.createElement("img");
	work.src = createWorkingLoc(working);
	work.alt = ((working) ? "Working" : "not Working");
	work.height=24;
	work.title = work.alt;
	work.classList.add("workIcon");
	work.id="r"+number+"work";
	rDiv.appendChild(work);

	document.getElementById("menu_container").appendChild(rDiv);

	return true;
}

function updateRobotBattery(robot, batteryStatus){
	var batt = document.getElementById("r"+robot+"batt");
	batt.src=createBatteryLoc(batteryStatus);
	batt.alt="Battery status " + batteryStatus+"%";
	setBannerText("Robot "+ robot+" is now at "+batt.alt, 1500);
	batt.title=batt.alt;
	return true;
}

function updateRobotWireless(robot, wirelessSignal){
	var wifi = document.getElementById("r"+robot+"wifi");
	wifi.src=createWirelessLoc(wirelessSignal);
	wifi.alt="Wireless signal " + wirelessSignal+"%";
	setBannerText("Robot "+ robot+" is now at "+wifi.alt, 1500);
	wifi.title=wifi.alt;
	return true;
}

function updateRobotWorking(robot, working){
	var work = document.getElementById("r"+robot+"work");
	if((work.alt ==="not Working" && working) || (work.alt==="Working" && !working)){
		work.src = createWorkingLoc(working);
		work.alt = ((working) ? "Working" : "not Working");
		setBannerText("Robot "+ robot +" is now "+ work.alt, 1500);
		work.title = work.alt;
		return true;
	}
	return false;
}


function createWorkingLoc (working) {
	if (working) {
		return "icons/working.png";
	}else{
		return "icons/nowork.png";
	}
}

function createBatteryLoc (batteryStatus) {
	var imgSrc = "";
	if(batteryStatus >= 0 && batteryStatus < 5){
		imgSrc = "icons/battery-empty.png";
	}else if (batteryStatus < 20) {
		imgSrc = "icons/battery-caution.png";
	}else if (batteryStatus < 40){
		imgSrc = "icons/battery-040.png";
	}else if (batteryStatus < 60){
		imgSrc = "icons/battery-060.png";
	}else if (batteryStatus < 80){
		imgSrc = "icons/battery-080.png";
	}else{
		imgSrc = "icons/battery-100.png";
	}
	return imgSrc;
}

function createWirelessLoc (wirelessSignal) {
	var imgSrc = "";
	if(wirelessSignal >= 0 && wirelessSignal < 5){
		imgSrc = "icons/network-wireless-0.png";
	}else if (wirelessSignal < 25){
		imgSrc = "icons/network-wireless-25.png";
	}else if (wirelessSignal < 50){
		imgSrc = "icons/network-wireless-50.png";
	}else if (wirelessSignal < 75){
		imgSrc = "icons/network-wireless-75.png";
	}else{
		imgSrc = "icons/network-wireless-100.png";
	}
	return imgSrc;
}

function mainMenu(elm){
	//Draw path submenu
	var drawPath = document.createElement("div");
	drawPath.id="drawPath";
	drawPath.classList.add("innerClick");
	drawPath.title="Drawing path";
	drawPath.onclick=innerClick;
	drawPath.innerHTML = "Draw path";
	//Waypoints submenu
	var wayp = document.createElement("div");
	wayp.id="waypoint";
	wayp.classList.add("innerClick");
	wayp.title="Add waypoints";
	wayp.onclick=innerClick;
	wayp.innerHTML="Place waypoints";
	//Formation submenu
	var formation = document.createElement("div");
	formation.id="formation";
	formation.classList.add("innerClick");
	formation.title="Select a formation";
	formation.onclick=innerClick;
	formation.innerHTML = "Formation";
	//Dance submenu
	var dance = document.createElement("div");
	dance.id="dance";
	dance.onclick=innerClick;
	dance.title="Who should dance?";
	dance.classList.add("innerClick");
	dance.innerHTML="Dance";
	/**
	//Games submenu
	var games = document.createElement("div");
	games.id="games";
	games.classList.add("innerClick");
	games.onclick=innerClick;
	games.innerHTML="Games";
	//Customize submenu
	var cust = document.createElement("div");
	cust.id="customize";
	cust.classList.add("innerClick");
	cust.onclick=innerClick;
	cust.innerHTML="Customize";
	//Map Area submenu
	var map = document.createElement("div");
	map.id="mapArea";
	map.classList.add("innerClick");
	map.onclick=innerClick;
	map.innerHTML="Map area";
	**/
	//Cancel submenu
	var canc = document.createElement("div");
	canc.id="cancel";
	canc.classList.add("innerClick");
	canc.onclick=actionClick;
	canc.innerHTML="Cancel action";
	//Close submenu
	var clos = document.createElement("div");
	clos.id="close";
	clos.classList.add("innerClick");
	clos.onclick=innerClick;
	clos.innerHTML = "Close";

	return [drawPath, formation, wayp, dance, /**games, cust, map,**/ canc, clos];
}

function clearDrawLine(){
	globalStage.getContainer().removeEventListener("mousedown", globalStage.__mousedown);
	globalStage.getContainer().removeEventListener("mousemove", globalStage.__mousemove);
	globalStage.getContainer().removeEventListener("mouseup", globalStage.__mouseup);
	globalStage.getContainer().removeEventListener("mousedown", globalStage.__mousedownwp);
	globalStage.getContainer().removeEventListener("mousemove", globalStage.__mousemovewp);
	globalStage.getContainer().removeEventListener("mouseup", globalStage.__mouseupwp);
	globalStage.setDraggable(true);
	var line;
	if(line = globalStage.get("#drawLine")[0]){
		line.remove();
	}
	globalLayer.drawScene();

}


function actionSendMovement(event){
	var caller = this;
	var line = globalStage.get("#drawLine")[0];
	var linePoints = line.getPoints();
	clearDrawLine();
	var robot = getRobotId(this);
	var data = {
		to: robot,
		data: {
			type: "move_request",
			request: linePoints
		}
	};
	sendMovementReq(data, function(bool){
		if(bool){
			removeMenu(caller);
		}else{
			alert("You have been eaten by a grue.\n"+
			"Lost connection to the server");
		}
	});

	event.stopPropagation();
}

function drawMenu(parent){
	clearDrawLine();
	globalStage.__moving=false;
	globalStage.__finished=false;
	globalStage.setDraggable(false);

	var robot = getRobotId(parent);
	globalStage.__line = new Kinetic.Line({
		points:[globalStage.get("#"+robot)[0].getPosition()],
		stroke:"red",
		id:"drawLine"
	});
	globalLayer.add(globalStage.__line);
	globalLayer.drawScene();

	if(!globalStage.__mousedown){
		globalStage.__mousedown = function(){
			if(globalStage.__finished){
				alert("Line already drawn.\nPlease send to robot or reset.");
			}else{
				var stagePos=globalStage.getAbsolutePosition();
				var mousePos=globalStage.getMousePosition();
				globalStage.__line.getPoints().push({x: mousePos.x-stagePos.x, y:mousePos.y-stagePos.y});

				globalStage.__moving=true;
				globalLayer.drawScene();
			}
		};
	}

	if(!globalStage.__mousemove){
		globalStage.__mousemove = function(){
			if(globalStage.__moving){
				var stagePos=globalStage.getAbsolutePosition();
				var mousePos=globalStage.getMousePosition();
				globalStage.__line.getPoints().push({x: mousePos.x-stagePos.x, y:mousePos.y-stagePos.y});

				globalStage.__moving=true;
				globalLayer.drawScene();
			}
		};
	}

	if(!globalStage.__mouseup){
		globalStage.__mouseup = function(){
			globalStage.__moving=false;
			globalStage.__finished=true;
		};
	}

	globalStage.getContainer().addEventListener("mousedown", globalStage.__mousedown);
	globalStage.getContainer().addEventListener("mousemove", globalStage.__mousemove);
	globalStage.getContainer().addEventListener("mouseup", globalStage.__mouseup);

	//Send path button
	var drawSend = document.createElement("div");
	drawSend.id="drawSend";
	drawSend.classList.add("innerClick");
	drawSend.onclick=actionSendMovement;
	drawSend.innerHTML="Send path";
	//Close submenu button
	var drawCanc = document.createElement("div");
	drawCanc.id="drawCancel";
	drawCanc.classList.add("innerClick");
	drawCanc.classList.add("closeMenu");
	drawCanc.onclick=innerClick;
	drawCanc.innerHTML="Cancel";

	return [drawSend, drawCanc];
}

function waypointMenu(parent){
	clearDrawLine();
	globalStage.__moving=false;
	globalStage.setDraggable(false);
	var robot= getRobotId(parent);

	globalStage.__line = new Kinetic.Line({
		points:[globalStage.get("#"+robot)[0].getPosition()],
		stroke:"red",
		id:"drawLine"
	});
	globalLayer.add(globalStage.__line);
	globalLayer.drawScene();

	if(!globalStage.__mousedownwp){
		globalStage.__mousedownwp = function(){
			var stagePos=globalStage.getAbsolutePosition();
			var mousePos=globalStage.getMousePosition();
			globalStage.__line.getPoints().push({x: mousePos.x-stagePos.x, y:mousePos.y-stagePos.y});

			globalStage.__moving=true;
			globalLayer.drawScene();
		};
	}

	if(!globalStage.__mousemovewp){
		globalStage.__mousemovewp = function(){
			if(globalStage.__moving){
				var stagePos=globalStage.getAbsolutePosition();
				var mousePos=globalStage.getMousePosition();
				var len = globalStage.__line.getPoints().length;
				globalStage.__line.getPoints()[len-1].x = mousePos.x-stagePos.x;
				globalStage.__line.getPoints()[len-1].y = mousePos.y-stagePos.y;

				globalStage.__moving=true;
				globalLayer.drawScene();
			}
		};
	}

	if(!globalStage.__mouseupwp){
		globalStage.__mouseupwp = function(){
			globalStage.__moving = false;
		};
	}

	globalStage.getContainer().addEventListener("mousedown", globalStage.__mousedownwp);
	globalStage.getContainer().addEventListener("mousemove", globalStage.__mousemovewp);
	globalStage.getContainer().addEventListener("mouseup", globalStage.__mouseupwp);
	//SendWaypointsButton
	var waypSend = document.createElement("div");
	waypSend.id="waypSend";
	waypSend.classList.add("innerClick");
	waypSend.onclick=actionSendMovement;
	waypSend.innerHTML="Send waypoints";
	//Close submenu button
	var waypCanc = document.createElement("div");
	waypCanc.id="waypCancel";
	waypCanc.classList.add("innerClick");
	waypCanc.classList.add("closeMenu");
	waypCanc.onclick=innerClick;
	waypCanc.innerHTML="Cancel";

	return [waypSend, waypCanc];
}
function formMenu(parent){
	//Figure-of-8 button
	var formFig8 = document.createElement("div");
	formFig8.id="formFig8";
	formFig8.classList.add("innerClick");
	formFig8.onclick=actionClick;
	formFig8.innerHTML="Figure of 8";
	//Square button
	var formSqua = document.createElement("div");
	formSqua.id="formSqua";
	formSqua.classList.add("innerClick");
	formSqua.onclick=actionClick;
	formSqua.innerHTML="Square";
	//Star button
	var formStar = document.createElement("div");
	formStar.id="formStar";
	formStar.classList.add("innerClick");
	formStar.onclick=actionClick;
	formStar.innerHTML="Star";
	//Close submenu button
	var formCanc = document.createElement("div");
	formCanc.id="formCancel";
	formCanc.classList.add("innerClick");
	formCanc.classList.add("closeMenu");
	formCanc.onclick=innerClick;
	formCanc.innerHTML="Cancel";

	return [formFig8, formSqua, formStar, formCanc];
}

function danceMenu(parent){
	//Dance alone
	var danceAlo = document.createElement("div");
	danceAlo.id="danceAlo";
	danceAlo.classList.add("innerClick");
	danceAlo.onclick=actionClick;
	danceAlo.innerHTML="Dance alone";
	//Dance together
	var danceTog = document.createElement("div");
	danceTog.id="danceTog";
	danceTog.classList.add("innerClick");
	danceTog.onclick=actionClick;
	danceTog.innerHTML="Dance together";
	//Close submenu
	var danceCanc = document.createElement("div");
	danceCanc.id="danceCanc";
	danceCanc.classList.add("innerClick");
	danceCanc.classList.add("closeMenu");
	danceCanc.onclick=innerClick;
	danceCanc.innerHTML="Cancel";

	return [danceAlo, danceTog, danceCanc];
}

function getRobotId(caller){
	var robot;
	if (caller.id==="cancel" || caller.id==="drawPath" || caller.id==="waypoint"){
		robot = caller.parentNode.parentNode.id.substring(1);
	} else {
		robot = caller.parentNode.parentNode.parentNode.parentNode.id.substring(1);
	}
	return robot;
}
