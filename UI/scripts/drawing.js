function drawRobot(id, x, y, direction) {
	var r = globalLayer.get("#" + id);
	if (r.length <= 0){
		var rWedge = new Kinetic.Wedge({
			x: x,
			y: y,
			radius: 70,
			angleDeg: 60,
			stroke: 'blue',
			strokeWidth: 3,
			rotationDeg: direction,
			id: id,
		});
		rWedge.setOffset(rWedge.getWidth() / 2.0, rWedge.getHeight() / 2.0);
		globalLayer.add(rWedge);
		globalStage.add(globalLayer);
	}else{
		__move(id, x, y, direction);
	}
}

//Private function
function __move(id, x, y, direction){
	var robo = globalStage.get("#" + id)[0];
	var newX = robo.getX() - x;
	var newY = robo.getY() - y;
	robo.move(newX, newY);
	robo.setRotationDeg(direction);
	globalLayer.add(robo);
	globalStage.add(globalLayer);
}
