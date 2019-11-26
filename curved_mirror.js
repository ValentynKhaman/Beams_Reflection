



function create(){
	var l = custom;
	var side = classify(mouse.x,mouse.y,l.sx,l.sy,l.fx,l.fy);
	var dist = distance(l.sx,l.sy,l.fx,l.fy);//length of a сhord
	var cx = (l.sx+l.fx)/2;
	var cy = (l.sy+l.fy)/2;		
	var angle = degree(l.sx,l.sy,mouse.x,mouse.y,l.fx,l.fy,mouse.x,mouse.y);//angle between lines projected from a choed to mouse position
	var radius = dist/(2*Math.sin(radians(angle)));// radius of a circle
	var disttocenter = Math.sqrt(radius*radius - (dist/2)*(dist/2));//distance from chord to circle center	
	var i=-1;
	if( side == "left"){
		i = 1;
	}
	linedeg = degry1(l.sx,l.sy,l.fx,l.fy)+90*i;
	var vx = Math.cos(radians(linedeg));
	var vy = Math.sin(radians(linedeg));
	if(angle>90){
		vx*=-1;
		vy*=-1;
	} 
	var enddeg = degry1(cx+vx*disttocenter,cy+vy*disttocenter,l.fx,l.fy);
	var strdeg = degry1(cx+vx*disttocenter,cy+vy*disttocenter,l.sx,l.sy);
	var rad1 = radians(strdeg);
	var rad2 = radians(enddeg);
	c.beginPath();//Circle
	c.strokeStyle = "white";
	if(i == 1)
		c.arc(cx+vx*disttocenter,cy+vy*disttocenter,radius,Math.PI + rad1,Math.PI + rad2);
	else
		c.arc(cx+vx*disttocenter,cy+vy*disttocenter,radius,Math.PI + rad2,Math.PI + rad1);
	c.stroke();
	
	var degr2 = degry1(cx+vx*disttocenter,cy+vy*disttocenter,l.sx,l.sy)+90;// starting angle of drawing for curve	
	var circlel = 2*Math.PI*radius;//circle length
	var chordl = circlel - (circlel/360)*2*angle; // length of a chord curve
	var degrofl = (360*chordl)/circlel; // how many angles does the chord curve occupy
	var sidelength = 5;// size of a line that will be used to build an actual curve
	var angleofoneside = degrees(sidelength/(2*radius));// how many angles of all circle one building segment occupies
	var allsides = 360/angleofoneside;
	var sides = degrofl/angleofoneside; // how many segments are needed to build actual curve
	var anglechange = 720/(allsides); // differance between n segment and n+1 in their degrees
	if(place){
		concave(l.sx,l.sy,radius,degr2-180,i,sides/2,anglechange,sidelength);
		place = false;
		anim = false;
		custom.fx = undefined;
	}
}
function concave(x,y,radius,angle,direction,sides,anglechange,L){
	var initx = x;
	var inity = y;
	var radius = radius;
	var len = L;
	var anglechange = anglechange;
	var circlel;
	var initA = angle;
	for(var i = 0;i<sides;i++){
		var rad = radians(initA);
		var vx = -Math.cos(rad); 
		var vy = -Math.sin(rad);
		var fx = initx - vx*len*direction;
		var fy = inity - vy*len*direction;
		lines.push(new Line(initx,inity,fx,fy));
		initx = fx;
		inity = fy;
		initA +=anglechange*direction;
	}
}
function classify(px,py,sx,sy,fx,fy) {
    var p2 = {x:px,y:py};
	var p0 = {x:sx,y:sy};
	var p1 = {x:fx,y:fy};
    var a = {
        x: p1.x - p0.x,
        y: p1.y - p0.y
    };

    var b = {
        x: p2.x - p0.x,
        y: p2.y - p0.y
    };
    var sa = a.x * b.y - b.x * a.y;
    if (sa < 0.0) return "left";	
}
function vector(sx,sy,fx,fy){
	if(sy>fy)
		return [sx,sy,fx,fy];
	return [fx,fy,sx,sy];
}
function degry1(x,y,fx,fy){
	var dist = Math.sqrt(Math.pow(x - fx,2)+Math.pow(y - fy,2));
	var vx = (x - fx)/dist;
	var vy = (fy - y)/dist;
	var degr = degrees(Math.acos(vx));//get current degree
		if(vy > 0)// if angle in 3-4 quater
	degr = 180 + (180-degr);
	return degr;
}
function degree(x1,y1,fx1,fy1,x2,y2,fx2,fy2){//degree between two lines
	var dAx = fx1 - x1;
	var dAy = fy1 - y1;
	var dBx = fx2 - x2;
	var dBy = fy2 - y2;
	var angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
	if(angle < 0) {angle = angle * -1;}
	return angle * (180 / Math.PI);
}
function distance(x,y,fx,fy){
	return Math.sqrt(Math.pow(x-fx,2)+ Math.pow(y-fy,2));
}