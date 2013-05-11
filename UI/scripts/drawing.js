function drawRobot(id, x, y, direction) {
	var r = globalLayer.get("#" + id);
	if (r.length <= 0){
		var rWedge = new Kinetic.Wedge({
			x: x,
			y: y,
			radius: 0.12*640/2,
			angleDeg: 350,
			stroke: 'blue',
			strokeWidth: 3,
			rotationDeg: direction + 10,
			id: id,
		});
		rWedge.setOffset(rWedge.getWidth() / 2.0, rWedge.getHeight() / 2.0);
		globalLayer.add(rWedge);
		globalLayer.drawScene();
	}else{
		__move(id, x, y, direction);
	}
}

//Private function
function __move(id, x, y, direction){
	var robo = globalStage.get("#" + id)[0];
	var newX = x - robo.getX();
	var newY = y - robo.getY();
	robo.move(newX, newY);
	robo.setRotationDeg(direction+5);
	globalLayer.drawScene();
}

//Keeps track of the currently selected robot
var curr_selected = null;
//Used for bolding and unbolding selected robot
function unselect(){
	if(curr_selected !== null){
		curr_selected.attrs.strokeWidth = 3;
		curr_selected = null;
		globalLayer.drawScene();
	}
}
function select(id){
	unselect();
	var robo = globalLayer.get("#" + id);
	if (robo.length > 0){
		robo[0].attrs.strokeWidth = 6;
		curr_selected = robo[0];
		globalLayer.drawScene();
	}
}