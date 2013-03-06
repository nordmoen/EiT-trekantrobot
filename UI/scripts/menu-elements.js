$(".clickable").click(function(){
    if(this.classList.contains("selected")){
        removeMenu(this);
    } else {
        addMenu(this);
    }
});


function addMenu(elm){
    $(".selected").each(function(index, element) {
        element.classList.remove("selected");
    });    
    elm.classList.add("selected");
}


function removeMenu(elm){
    elm.classList.remove("selected");
}