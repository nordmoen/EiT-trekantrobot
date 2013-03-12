$(document).ready(function(){
	$(".innerClick").click(function(e){
			alert(this.id);
			if(this.id=="close"){
				removeMenu(this.parentNode.parentNode);
			}else{
				addMenu(this)
			}
			e.stopPropagation();
	});
	$(".clickable").click(function(){
		alert(this.id);
		if(this.classList.contains("selected") && this.classList.contains("robot")){
			//removeMenu(this);
		} else {
			addMenu(this);
		}
	});
	
});

function addMenu(elm){
    if(elm.classList.contains("robot")){
    	$(".selected").each(function(index, element) {
    		//removeMenu(element);
    	});    
    }
    elm.classList.add("selected");
    setBannerText(elm.title, -1);
    var menuDiv = document.createElement("div");
    menuDiv.id = "menuDiv";
    menuDiv.classList.add("innerClick");
    menuDiv.innerHTML = "<hr />";
    var children = createMenuDiv(elm);
    elm.appendChild(menuDiv);
    menuDiv.style.zIndex=menuDiv.parentNode.style.zIndex + 1;
    for( var i=0; i < children.length; i++){
        menuDiv.appendChild(children[i]);
        menuDiv.lastChild.style.zIndex=menuDiv.style.zIndex + 1;
    }
    
    $("#menuDiv").effect( "slide", {direction:"right"}, 250, function () {} );
}


function removeMenu(elm){
    var rem = document.getElementById("menuDiv");
    elm.removeChild(rem);
    elm.classList.remove("selected");
    clearBanner(); //Clear banner since nothing is selected anymore
}

// Dummy-function, needs to add proper elements that expand and work.
function createMenuDiv(parent){
	if (parent.classList.contains("robot")){
		return mainMenu(parent);
	}
	if (parent.id="drawPath"){
		return drawMenu(parent);
	}
}

function createRobotDiv (number, wirelessSignal, batteryStatus, working) {
	var rDiv = document.createElement("div");
	rDiv.classList.add("robot");
	rDiv.id = "robot" + number;
	rDiv.title = "Robot " + number;
}

function createWorkingElement (working) {
	if (working) {
		return "<img src=\"icons/working.png\" alt=\"Working\">";
	}else{
		return "";
	}
}

function createBatteryElement (batteryStatus) {
	var imgSrc = "";
	if(batteryStatus >= 0){
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
	return "<img src=\"" + imgSrc + "\" alt=\"Battery status " + batteryStatus +
		"\">";
}

function createWirelessElement (wirelessSignal) {
	var imgSrc = "";
	if(wirelessSignal >= 0){
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
	return "<img src=\"" + imgSrc + "\" alt=\"Wireless signal " + wirelessSignal +
		"\">";
}

function mainMenu(elm){
	//Draw path submenu
	var drawPath = document.createElement("div");
	drawPath.id="drawPath";
	drawPath.classList.add("innerClick");
	drawPath.innerHTML = "Draw path";
	//Formation submenu
	var formation = document.createElement("div");
	formation.id="formation";
	formation.classList.add("innerClick");
	formation.innerHTML = "Formation";
	//Dance submenu
	var dance = document.createElement("div");
	dance.id="dance";
	dance.classList.add("innerClick");
	dance.innerHTML="Dance";
	/**
	//Games submenu
	var games = document.createElement("div");
	games.id="games";
	games.classList.add("innerClick");
	games.innerHTML="Games";
	//Customize submenu
	var cust = document.createElement("div");
	cust.id="customize";
	cust.classList.add("innerClick");
	cust.innerHTML="Customize";
	//Map Area submenu
	var map = document.createElement("div");
	map.id="mapArea";
	map.classList.add("innerClick");
	map.innerHTML="Map area";
	**/
	//Cancel submenu
	var canc = document.createElement("div");
	canc.id="cancel";
	canc.classList.add("innerClick");
	canc.innerHTML="Cancel action";
	//Close submenu
	var clos = document.createElement("div");
	clos.id="close";
	clos.classList.add("innerClick");
	clos.innerHTML = "Close";
	
	return [drawPath, formation, dance, /**games, cust, map,**/ canc, clos];
}

function drawMenu(parent){
	window.alert("yo");
	var drawSend = document.createElement("div");
	drawSend.id="drawSend";
	drawSend.classList.add("innerClick");
	drawSend.innerHTML="Send path";
	
	var drawCanc = document.createElement("div");
	drawCanc.id="drawCancel";
	drawCanc.classList.add("innerClick");
	drawCanc.innerHTML="Cancel";
	
	return [drawSend, drawCanc];
}
