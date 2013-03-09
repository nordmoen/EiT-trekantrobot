//This file contains functions which deals with the banner on top of the UI
var defaultText = "Trekantrobot";

function clearHeader (timeout) {
	//Timeout in ms
	setTimeout(function () {
		$("#banner").text(defaultText);
	}, timeout);
}

function setBannerText(text, timeout) {
	//Timeout in ms
	$("#banner").text(text);
	if (timeout > 0) {
		//If timeout is -1 do not timeout
		clearHeader(timeout);
	}
}
