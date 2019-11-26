function Ligth(x,y){
	this.x = x;
	this.y = y;
	this.beems = [];
	this.amount = 100;
	this.width_of_beem = 0.8;
	this.init = function(Angle,spread){
		console.log(spread);
		if(spread ==0 || spread == 180){
			spread = 0.5;
		}
		console.log(spread);
		this.beems.splice(0,this.beems.length-1);
		var initdeg = Angle - spread;
		var enddeg = Angle + spread;
		var diff = enddeg-initdeg;
		for(var i = 0;i<this.amount;i++){
			var vx = -Math.cos(radians(initdeg));
			var vy = -Math.sin(radians(initdeg));
			this.beems.push(new Beem(this.x,this.y,vx,vy,this.width_of_beem));
			this.beems[i].update();
			initdeg+=diff/this.amount;
		}
	}
	this.draw = function(){
		for(var i = 0;i<this.amount;i++){
			this.beems[i].draw();
		}
	}
	this.update = function(){
		for(var i = 0;i<this.amount;i++){
			this.beems[i].update();
		}
	}
}