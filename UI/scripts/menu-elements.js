$(document).ready(function(){
	$(".clickable").click(function(){
	    if(this.classList.contains("selected")){
		removeMenu(this);
	    } else {
		addMenu(this);
	    }
	});
});


function addMenu(elm){
    $(".selected").each(function(index, element) {
    	removeMenu(element);
    });    
    elm.classList.add("selected");
    setBannerText(elm.title, -1);
    var menuDiv = document.createElement("div");
    menuDiv.id = "menuDiv";
    menuDiv.innerHTML = createMenuDiv(this);
    elm.appendChild(menuDiv);
    $("#menuDiv").effect( "slide", {direction:"right"}, 250, function () {} );
}


function removeMenu(elm){
    var rem = document.getElementById("menuDiv");
    elm.removeChild(rem);
    elm.classList.remove("selected");
    clearBanner(); //Clear banner since noting is selected anymore
}

// Dummy-function, needs to add proper elements that expand and work.
function createMenuDiv(elm){
	return "<hr /> Test 01 <hr /> Test 02 <hr /> Test 03 <hr /> Cancel <hr /><hr />";
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
	if(batteryStatus < 0){
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
	if(wirelessSignal < 0){
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

