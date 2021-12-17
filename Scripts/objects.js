

// List of objects
var objArray = [
	"P1.png",
	"P2.png",
	"P3.png"
];

var entities = [];

/*****************************  DRAW METEOR  **********************************/
function Meteoro(x, y, radious, color, velX, velY, id){
	this.x = x;
	this.y = y;
	this.radious = radious;
	this.color = color;
	this.velX = velX;
	this.velY = velY;
	this.id = id;
	this.offsetX = 4;
	this.offsetY = 2;
	this.offsetvelX = 1;
	this.offsetvelY = 1;
	this.font = 13;
	this.fontChange = 1;
	this.cnt = 0;

	this.draw = function(){
		if(id==3){
			ctx.shadowBlur = 10;
			ctx.shadowColor = "Black";
		}
		else{
			ctx.shadowBlur = 10;
			ctx.shadowColor = "#2BC3FF";	
		}
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radious, 0, Math.PI*2, false);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.shadowBlur = 0;

		if(id==0){
			ctx.font = this.font.toString()+"px Arial";
			ctx.fillStyle = "#2497c1";
			ctx.fillText("S", this.x, this.y+4);
		}
		else if(id==1){
			ctx.font = this.font.toString()+"px Arial";
			ctx.fillStyle = "#2497c1";
			ctx.fillText("L", this.x, this.y+4);
		}
		else if(id==2){
			ctx.font = this.font.toString()+"px Arial";
			ctx.fillStyle = "#2497c1";
			ctx.fillText("H", this.x, this.y+4);
		}
		else{
			/*ctx.beginPath();
			ctx.arc(this.x+this.offsetX, this.y+this.offsetY, 3, 0, Math.PI*2, false);
			ctx.fillStyle = "#64000A";
			ctx.fill();*/
			if(this.cnt==10)
				this.color = "#64000A";
			else if(this.cnt>20){
				this.color = "#9b0007";
				this.cnt=0;
			}
		}

		if(this.font > 16 || this.font < 9)
			this.fontChange *= -1;

		//console.log(this.x,this.y);
	}

	this.update = function(){
		this.x += this.velX;
		this.y += this.velY;
		this.offsetX += this.offsetvelX;
		this.offsetY += this.offsetvelY;
		this.font += this.fontChange;
		this.cnt++;

		this.draw();
	}
}

/*****************************  RANDOM VALUES  **********************************/
function getRandomVelX(angle,speed){
	//return -(Math.random()+.1)*.9;
	return Math.sin(angle) * speed;
}
function getRandomVelY(angle,speed){
	//return (Math.random()+.1)*.9;
	return Math.cos(angle) * speed;
}

function getRandomPointX(intervalo) {
	//return (Math.random() * (intervalo-1))+mRadio;
	return Math.random() * (window.innerWidth);
}
function getRandomPointY(intervalo) {
	//return (Math.random() * (intervalo-1))+mRadio;
	return Math.random()*-50;
}

/******************************* RANDOM COLORS *****************************/
function getRandomColor(){
	var pos = Math.random();
	if(pos>=.01)
		pos=0;
	else
		pos=1;
	var index = parseInt(pos);
	return colores[index];	
}

/********************************  CREATE METEOR  **********************************/
function createCircle(){
	var angle = Math.random() * Math.PI - (Math.PI * 0.5);
	var speed = (Math.random()+.2) * power_speed;

	var random_x = getRandomPointX(900);
	var random_y = getRandomPointY(100);

	var random_speed_x = getRandomVelX(angle, speed);
	var random_speed_y = getRandomVelY(angle, speed);

	var id = 0;
	var rand = Math.random();

	if(rand < power_probability){
		var c = new Meteoro(random_x, random_y, power_size, "#050047", random_speed_x, random_speed_y, id);
		meteors.push(c);
		c.draw();
	}
	 			
	else if(rand > (.1 + power_probability) && rand < (.15 + power_probability)){
		id = 1;
		var c = new Meteoro(random_x, random_y, power_size, "#050047",random_speed_x, random_speed_y, id);
		meteors.push(c);
		c.draw();
	}

	else if(rand > (.8 + power_probability) && rand < (.85 + power_probability)){
		id = 2;
		var c = new Meteoro(random_x, random_y, power_size, "#050047",random_speed_x, random_speed_y, id);
		meteors.push(c);
		c.draw();
	}

	else{
		id = 3;
		random_speed_x = getRandomVelX(angle, speed);
		random_speed_y = getRandomVelY(angle, speed);
		var c = new Meteoro(random_x, random_y, meteor_size, "#9b0007",random_speed_x, random_speed_y, id);
		meteors.push(c);
		c.draw();
	}
}

function Star(options){
	this.size = Math.random()*4;
	this.speed = Math.random()*1.5;
	this.x = options.x;
	this.y = options.y;
}

Star.prototype.reset = function(){
	this.size = Math.random()*4;
	this.speed = Math.random()*1.5;
	this.x = canvas.width;
	this.y = Math.random()*canvas.height;
}

Star.prototype.update = function(){
	this.x-=this.speed;
	if(this.x<0){
	  this.reset();
	}else{
	  ctx.fillRect(this.x,this.y,this.size,this.size); 
	}
}

	function ShootingStar(){
		this.reset();
	}
	
	ShootingStar.prototype.reset = function(){
		this.x = Math.random()*canvas.width;
		this.y = 0;
		this.len = (Math.random()*80)+10;
		this.speed = (Math.random()*10)+6;
		this.size = (Math.random()*1)+0.1;

    // this is used so the shooting stars arent constant
		this.waitTime =  new Date().getTime() + (Math.random()*3000)+500;
		this.active = false;
	}
	
	ShootingStar.prototype.update = function(){
		if(this.active){
			this.x-=this.speed;
			this.y+=this.speed;
			if(this.x<0 || this.y >= canvas.height){
			  this.reset();
			}else{
			ctx.lineWidth = this.size;
				ctx.beginPath();
				ctx.moveTo(this.x,this.y);
				ctx.lineTo(this.x+this.len, this.y-this.len);
				ctx.stroke();
			}
		}else{
			if(this.waitTime < new Date().getTime()){
				this.active = true;
			}			
		}
	}

function initStars(){
	// init the stars
	for(let i=0; i < canvas.height; i++){
		entities.push(new Star({x:Math.random()*canvas.width, y:Math.random()*canvas.height}));
	}

	// Add 2 shooting stars that just cycle.
	entities.push(new ShootingStar());
	entities.push(new ShootingStar());
}

//animate background
function animate(){
	ctx.fillStyle = '#FFF';
	var entLen = entities.length;
  
	while(entLen--){
		entities[entLen].update();
	}
	
	requestAnimationFrame(initUpdates);
}

function preloadimages(){
    for (let i=0; i<backgrounds.length; i++){
        images[i]=new Image();
        images[i].src=backgrounds[i]
    }
}
