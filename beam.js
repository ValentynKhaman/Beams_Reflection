
function Beem(x,y,vx,vy,w){
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.dist = 0;
	this.history = [[this.x,this.y]];
	this.histind = 1;
	this.ricoshets = 0;
	this.width = w;
	this.speed = sp;
	this.update = function(){
		var bool = true;
		for(var circle of circles){
			if(collision(this.x,this.y,this.x+this.vx*this.speed,this.y+this.vy*this.speed,circle.x,circle.y,circle.r)){			
				thisdeg = degry(this.x,this.y,this.x+this.vx,this.y+this.vy);
				cd = degry(this.x,this.y,circle.x,circle.y);
				this.history.push([this.x+this.vx,this.y+this.vy]);
				this.histind++;
				var diff = thisdeg - cd;
				var Ndeg = cd - diff;
				rad = radians(Ndeg);
				this.vx = Math.cos(rad);
				this.vy = -Math.sin(rad);
				bool = false;
			}
		}
		var arroflines = [];
		for(var l of lines){
			var points = intersects(l.sx,l.sy,l.fx,l.fy,this.x,this.y,this.x+this.vx*this.speed,this.y+this.vy*this.speed);
			if(points){
				var dist = distance(points.x,points.y,this.x,this.y);
				arroflines.push([points,dist,[l.sx,l.sy,l.fx,l.fy]]);
			}
		}
		if(arroflines.length){
			var Closest = closest(arroflines);
			var inf = arroflines[Closest];
			
			linedeg = degry(inf[2][0],inf[2][1],inf[2][2],inf[2][3])-90;
			beemdeg = degry(this.x,this.y,this.x+this.vx,this.y+this.vy);
			this.x = arroflines[Closest][0].x-this.vx;
			this.y = arroflines[Closest][0].y-this.vy;
			this.history[this.histind] = [arroflines[Closest][0].x,arroflines[Closest][0].y];
			this.history.push([inf[0].x,inf[0].y]);
			var dif = beemdeg - linedeg;
			var Ndeg = linedeg - dif;
			var rad = radians(Ndeg);
			this.vx = Math.cos(rad);
			this.vy =-Math.sin(rad);
			this.histind++;
			bool = false;
		}
		if(bool)this.increace();
	}
	this.increace = function(){
		this.dist++;
		this.x += this.vx*this.speed;
		this.y += this.vy*this.speed;
		var ar = [this.x,this.y];
		this.history[this.histind] = ar;
	}
	this.draw = function(){
			c.beginPath();
			for(var i = 0;i < this.history.length-1;i++){
				c.moveTo(this.history[i][0],this.history[i][1]);
				c.lineTo(this.history[i+1][0],this.history[i+1][1]);
			}
			c.strokeStyle = "#FFFF66";
			c.lineWidth = this.width;
			c.stroke();
			c.beginPath();
			c.fillStyle = "red";
			c.arc(this.x,this.y,2,0,Math.PI*2);
			c.fill();
	}
}
function closest(ar){
	var index;
	var dist = 300;
	for(var i = 0;i<ar.length;i++){
		if(ar[i][1] < dist){
			index = i;
			dist = ar[i][1];
		}
	}
	return index;
}

function drawline(x,y,fx,fy){
	c.beginPath();
	c.strokeStyle = "red";
	c.moveTo(x,y);
	c.lineTo(fx,fy);
	c.stroke();
}