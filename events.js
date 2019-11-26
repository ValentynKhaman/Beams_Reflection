document.onmousedown = function(){
	var x = event.clientX;
	var y = event.clientY;
	var oldx = click.x;
	var oldy = click.y;
	click.x = x;
	click.y = y;
	switch (event.which){
		case 1:
			Dist = 0;
			if(createcurve){
				if(custom.fx){
					place = true;
					createcurve = false;
				}
				else{
					custom.sx = x;
					custom.sy = y;
					anim = true;
				}
			}
			else if(addligth){
				if (mouseup.x != click.x && mouseup.y != click.y){	
					var dist = Math.sqrt(Math.pow(oldx-mouseup.x,2)+Math.pow(oldy-mouseup.y,2));
					var vx = (oldx-mouseup.x)/dist;
					var vy = (oldy-mouseup.y)/dist;
					var deg = degrees(Math.acos(vx));
					if(vy < 0)
						deg = 180 + (180-deg);
					var degr = degree(mouseup.x,mouseup.y,oldx,oldy,mouse.x,mouse.y,oldx,oldy);
					ligth.push(new Ligth(oldx,oldy));
					ligth[ligth.length - 1].init(deg,degr);
					
				}
				animlight = false;
				addligth = false;
			}
			draw = true;
		break;
	}
}

document.onmouseup = function(){
	var x = event.clientX;
	var y = event.clientY;
	mouse.x = x;
	mouse.y = y;

	draw = false;
	switch (event.which){
		case 1:
			if(createcurve){
				var coordinats = vector(custom.sx,custom.sy,x,y);
				custom.sx = coordinats[0];
				custom.sy = coordinats[1];
				custom.fx = coordinats[2];
				custom.fy = coordinats[3];
			}
			else if(index == 0)
				lines.push(new Line(click.x,click.y,mouse.x,mouse.y));
			else if (index == 1 && Dist > 15)
				circles.push(new Circle(click.x,click.y,Dist));
			else if(index == 2){
				addligth = true;
				animlight = true;
			}
		break;
	}
		mouseup.x = x;
	mouseup.y = y;
}
document.onkeydown = function(){
	switch (event.keyCode){
		case 65:
			createcurve = true;
			break;
		case 49:
			index = 0;
			break;
		case 50:
			index = 1;
			break;
		case 51:
			index = 2;	
	}
}
document.onmousemove = function(){// оновлення координат при зміні позиції миші
	mouse.x = event.clientX;
	mouse.y = event.clientY;
	Dist = Math.sqrt(Math.pow(mouse.x-click.x,2)+Math.pow(mouse.y-click.y,2));
}
window.onresize = function(){
	canvas.width = innerWidth;
	canvas.height = innerHeight;
}