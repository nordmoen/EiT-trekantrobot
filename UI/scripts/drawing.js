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
			id: id
		});
		globalLayer.add(rWedge);
		globalStage.add(globalLayer);
	}else{
		move(id, x, y, direction);
	}
}

function move(id, x, y, direction){
	var robo = globalLayer.get("#" + id);
	robo.setX(x);
	robo.setY(y);
	robo.setRotationDeg(direction);
}
