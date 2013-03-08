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
}

// Dummy-function, needs to add proper elements that expand and work.
function createMenuDiv(elm){
	return "<hr /> Test 01 <hr /> Test 02 <hr /> Test 03 <hr /> Cancel <hr /><hr />";
}
