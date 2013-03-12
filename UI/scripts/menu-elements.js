$(document).ready(function(){
	$(".clickable").click(function(){
		if(this.classList.contains("selected") && this.classList.contains("robot")){
			removeMenu(this);
		} else {
			addMenu(this);
		}
	});
	
});

function innerClick(event){
		if(this.id==="close"){
			removeMenu(this);
		}else if(this.classList.contains("closeMenu")){
			removeMenu(this);
		}else if(!this.classList.contains("selected")){
			addMenu(this)
		}
		event.stopPropagation();
}

function addMenu(elm){
    if(elm.classList.contains("robot")){
    	$(".selected").each(function(index, element) {
    		removeMenu(element);
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


function removeMenu(elm){
	if(elm.classList.contains("robot")){
		elm.removeChild(elm.lastChild);
		elm.classList.remove("selected");
		resetBanner();
	} else{
		var par1 = elm.parentNode;
		var par2;
		if(par2 = par1.parentNode){
			par2.removeChild(par1);
			par2.classList.remove("selected");
		}
		setBannerText(par2.title, -1);
	}
	
}

// Dummy-function, needs to add proper elements that expand and work.
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
		return danceMenu(parent)
	}
}

function createRobotDiv (number, wirelessSignal, batteryStatus, working) {
	var rDiv = document.createElement("div");
	rDiv.classList.add("robot");
	rDiv.id = "r" + number;
	rDiv.title = "Robot " + number;
	rDiv.innerHTML=rDiv.title;
	
	var batt = document.createElement("img");
	batt.src=createBatteryLoc(batteryStatus);
	batt.alt="Battery status " + batteryStatus;
	batt.id="r"+number+"batt";
	rDiv.appendChild(batt);
	
	var wifi = document.createElement("img");
	wifi.src=createWirelessLoc(wirelessSignal);
	wifi.alt="Wireless signal " + wirelessSignal+"%";
	wifi.id="r"+number+"wifi";
	rDiv.appendChild(wifi);
	
	document.getElementById("menu_container").appendChild(rDiv);
}

function createWorkingElement (working) {
	if (working) {
		return "<img src=\"icons/working.png\" alt=\"Working\">";
	}else{
		return "";
	}
}

function createBatteryLoc (batteryStatus) {
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
	return imgSrc;
}

function createWirelessLoc (wirelessSignal) {
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
	//Formation submenu
	var formation = document.createElement("div");
	formation.id="formation";
	formation.classList.add("innerClick");
	formation.onclick=innerClick;
	formation.innerHTML = "Formation";
	//Dance submenu
	var dance = document.createElement("div");
	dance.id="dance";
	dance.onclick=innerClick;
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
	//canc.onclick=innerClick;
	canc.innerHTML="Cancel action";
	//Close submenu
	var clos = document.createElement("div");
	clos.id="close";
	clos.classList.add("innerClick");
	clos.onclick=innerClick;
	clos.innerHTML = "Close";
	
	return [drawPath, formation, dance, /**games, cust, map,**/ canc, clos];
}

function drawMenu(parent){
	//Send path button
	var drawSend = document.createElement("div");
	drawSend.id="drawSend";
	drawSend.classList.add("innerClick");
	//drawSend.onclick=innerClick;
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

function formMenu(parent){
	//Figure-of-8 button
	var formFig8 = document.createElement("div");
	formFig8.id="formFig8";
	formFig8.classList.add("innerClick");
	//formFig8.onclick=innerClick;
	formFig8.innerHTML="Figure of 8";
	//Square button
	var formSqua = document.createElement("div");
	formSqua.id="formSqua";
	formSqua.classList.add("innerClick");
	//formSqua.onclick=innerClick;
	formSqua.innerHTML="Square";
	//Star button
	var formStar = document.createElement("div");
	formStar.id="formStar";
	formStar.classList.add("innerClick");
	//formStar.onclick=innerClick;
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
	//danceAlo.onclick=innerClick;
	danceAlo.innerHTML="Dance alone";
	//Dance together
	var danceTog = document.createElement("div");
	danceTog.id="danceTog";
	danceTog.classList.add("innerClick");
	//danceTog.onclick=innerClick;
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
