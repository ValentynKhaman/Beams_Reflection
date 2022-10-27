var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
canvas.style.background = "black";
"use strict";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var lastCalledTime;
var fps;
var fff = true;
var sp = 4;
var mouse = {// initial mouse coordinates
	x:undefined,
	y:undefined
}
var mouseup = {
	x:undefined,
	y:undefined
}
var click = {
	x:undefined,
	y:undefined
}
var custom = {
	sx:undefined,
	sy:undefined,
	fx:undefined,
	fy:undefined
}
var createcurve = false;
var addligth = false;
var anim = false;
var place = false;
var animlight = false;

var index = -1;
var Dist = 0;
var draw = false;
var lines = []
var circles = [];
var ligth = [];

function Line(sx,sy,fx,fy){
	this.sx = sx;
	this.sy = sy;
	this.fy = fy;
	this.fx = fx;
	this.color = "silver";
	this.dist = Math.sqrt((this.sx - this.fx) * (this.sx - this.fx) + (this.sy - this.fy) * (this.sy - this.fy));
	this.vx = -(this.sx - this.fx) / this.dist;
	this.vy = (this.sy - this.fy) / this.dist;
	this.draw = function(){
		c.beginPath();
		c.moveTo(this.sx,this.sy);
		c.lineTo(this.fx,this.fy);
		c.strokeStyle = this.color;
		c.lineWidth = 1.5;
		c.stroke();
	}
}
function Circle(x,y,r){
	var self = this;
	this.x = x;
	this.y = y;
	this.r = r;
	this.ammo = this.amount;
	this.color = "gray";
	this.draw = function (){
		c.beginPath();
		c.fillStyle = this.color;
		c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		c.fill();
	}
}

function prossess(){
	for(var i =0;i<5000;i++){
		ligth[ligth.length-1].update();
	}
}

function render(){
	c.clearRect(0,0,innerWidth,innerHeight);
	if(anim){
		c.beginPath();
		c.fillStyle = "red";
		c.arc(custom.sx,custom.sy,2,0,Math.PI*2);
		c.fill();
		if(custom.fx){
			c.beginPath();
			c.fillStyle = "red";
			c.arc(custom.fx,custom.fy,2,0,Math.PI*2);
			c.fill();
			create();
		}
	}
	else if(animlight){
		c.beginPath();
		c.strokeStyle = "silver";
		c.moveTo(click.x,click.y);
		c.lineTo(mouseup.x,mouseup.y);
		c.stroke();
		var degrofline = degry1(mouseup.x,mouseup.y,click.x,click.y);
		var degr = degree(mouseup.x,mouseup.y,click.x,click.y,mouse.x,mouse.y,click.x,click.y);
		var left = degrofline - degr;	
		var right = degrofline + degr;
		var vx = Math.cos(radians(left));
		var vy = Math.sin(radians(left));
		var dist = distance(click.x,click.y,mouse.x,mouse.y);
		c.strokeStyle = "silver";
		c.lineWidth = 1;
		drawline(click.x,click.y,click.x+vx*dist,click.y+vy*dist);
		vx = Math.cos(radians(right));
		vy = Math.sin(radians(right));
		drawline(click.x,click.y,click.x+vx*dist,click.y+vy*dist);
		degr = degrofline;
		degr -=20;
		drawline(mouseup.x,mouseup.y,mouseup.x+20*-Math.cos(radians(degr)),mouseup.y+20*-Math.sin(radians(degr)));
		degr +=40;
		drawline(mouseup.x,mouseup.y,mouseup.x+20*-Math.cos(radians(degr)),mouseup.y+20*-Math.sin(radians(degr)));
	}
	else if(draw){
		if(index == 0 || index == 2){
			c.beginPath();
			c.strokeStyle = "silver";
			c.moveTo(mouse.x,mouse.y);
			c.lineTo(click.x,click.y);
			c.stroke();
			if(index == 2 ){
				var degr = degry(click.x,click.y,mouse.x,mouse.y);
				degr -=15;
				drawline(mouse.x,mouse.y,mouse.x+20*Math.cos(radians(degr)),mouse.y+20*-Math.sin(radians(degr)));
				degr +=30;
				drawline(mouse.x,mouse.y,mouse.x+20*Math.cos(radians(degr)),mouse.y+20*-Math.sin(radians(degr)));
			}
		}
		else if(index == 1){
		c.beginPath();
		c.fillStyle = "gray";
		c.arc(click.x,click.y,Dist,0,Math.PI*2);
		c.fill();
		}
	}
	
	for(var i = 0;i<ligth.length;i++){
		ligth[i].update();
		ligth[i].draw();
	}
	for(var circle of circles)
		circle.draw();
	for(var line of lines)
		line.draw();
	
	var delta = (Date.now() - lastCalledTime)/1000;
	lastCalledTime = Date.now();
	fps = Math.floor(1/delta);
	drawtext(fps,30,30,"red");
	requestAnimationFrame(render);
}
render();
function degrees(radians){
	return radians * 180 / Math.PI;
}
function radians(degrees){
	return degrees * Math.PI / 180;
}
window.oncontextmenu = function(){
	 event.preventDefault(); 
}
function getNewVector(trig,offset,vx,vy){ // trig if 0 - return vX else return vY
	var degr = degrees(Math.acos(vx));//get current degree
	if(vy < 0)// if angle in 3-4 quater
		degr = 180 + (180-degr);
	degr -=offset; //translate offset degrees
	var radX = radians(degr);//convert to radians
	var vx = Math.cos(radX);//get new vector X
	var vy = Math.sin(radX);
	if(trig == 0)
		return vx;	
	else
		return vy;
}
function collision(Ax,Ay,Bx,By,Cx,Cy,R){
	var Dx = Bx - Ax;
	var Dy = By - Ay;
	var LAB = Dx*Dx+Dy*Dy;
	var t = ((Cx - Ax) * Dx + (Cy - Ay) * Dy) / LAB;
	if(t>1)
		t = 1;
	else if(t < 0)
		t = 0
	var nearestX = Ax + t * Dx;
	var nearestY = Ay + t * Dy;
	var dist = Math.sqrt( (nearestX-Cx)*(nearestX-Cx) + (nearestY-Cy)*(nearestY-Cy) );
	if (dist < R)
		return true;
}

function degry(x,y,fx,fy){
	var dist = Math.sqrt(Math.pow(x - fx,2)+Math.pow(y - fy,2));
	var vx = (x - fx)/dist;
	var vy = (y - fy)/dist;
	var degr = degrees(Math.acos(vx));//get current degree
		if(vy > 0)// if angle in 3-4 quater
	degr = 180 + (180-degr);
	return degr;
}
function drawtext(text,x,y,color){
	c.font = "20px Arial";
	c.fillStyle = color;
	c.textAlign= "center";
	c.fillText(text,x,y);
}
function intersects(x1,y1,x2,y2,x3,y3,x4,y4) {
  var det, gamma, lambda;
  det = (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1);
  if (det === 0) {
    return false;
  } else {
    lambda = ((y4 - y3) * (x4 - x1) + (x3 - x4) * (y4 - y1)) / det;
    gamma = ((y1 - y2) * (x4 - x1) + (x2 - x1) * (y4 - y1)) / det;
	if((0 < lambda && lambda < 1) && (0 < gamma && gamma < 1)){
		let x = x1 + lambda * (x2 - x1);
		let y = y1 + lambda * (y2 - y1);
		return {x,y};
	}
	else return false;
	}
};

function drawline(x,y,fx,fy){
	c.beginPath();
	c.moveTo(x,y);
	c.lineTo(fx,fy);
	c.stroke();
}

function Table(x,y){
	this.x = x; 
	this.y = y; 
	this.w = 100;
	this.h = 100;
	this.active = false;
	this.draw = function(){
		drawl(this.x,this.y);
		c.strokeStyle = "gray";
		c.lineWidth = 1;
		c.strokeRect(this.x,this.y,this.w,this.h);
		c.stroke();
		
		if(this.active){
			c.strokeStyle = "red";
			c.lineWidth = 10;
			c.strokeRect(this.x+5,this.y+5,this.w-5,this.h-5);
			c.stroke();
			c.lineWidth = 1;
		}
				
	}
}
function drawl(x,y){
	c.beginPath();
	c.lineWidth = 1;
	c.strokeStyle = "yellow";
	c.moveTo(x+80,y+20);
	c.lineTo(x+20,y+80);
	c.closePath();
	c.stroke();
}