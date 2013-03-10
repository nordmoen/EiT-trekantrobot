//This file contains functions which deals with the banner on top of the UI
var defaultText = "Trekantrobot";
var canClear = true;

function clearBanner (timeout) {
	//Timeout in ms
	setTimeout(function () {
		if(canClear){
			//Done to ensure that if another set banner is called
			//which should not clear the banner, a previous clear
			//does not clear it again
			$("#banner").text(defaultText);
		}
	}, timeout);
}

function setBannerText(text, timeout) {
	//Timeout in ms
	$("#banner").text(text);
	if (timeout > 0) {
		//If timeout is -1 do not timeout
		canClear = true;
		clearBanner(timeout);
	}else{
		canClear = false;
	}
}
