// Canvas Variables
var canvas;
var ctx;
var drawing = new Image();

// Game States
var gameState = 0;
var paused = false;

// 0 = Main Menu
// 1 = Difficulty Selector
// 2 = Main Game
// 3 = End Game Screen
// 4 = 2 Players Screen
// 5 = Configurations
// 6 = Pause Screen
// 7 = Scores Screen
// 8 = CutScenes
// 9 = NewRecord Screen
// 10 = Game Over Screen
// 11 = Start Menu

// Actual game variables
var actual_difficulty = 0; 						
var images=[];

var number_of_meteors; 			
var power_size; 					
var meteor_size; 						
var user_size; 						

var power_speed; 						
var meteor_speed; 						
var user_speed;  					

var power_probability; 						
var difficulty_bonus; 							

var meteors= []; 				
var firstClick = false;
var actual_song = 0; 	

var powerUp = {
	name: '',
	time: 0,
	color: '',
	enabled: false
};

var difficulty_text= [
	"Noob",
	"Ez",
	"Respect",
	"Pro"
];

var speed_bonus = 0; 					
const isStorage = 'undefined' 
	!== typeof localStorage;

var mouse = { 						
	x : 0,
	y : 0
};

var mousePaused = {	 				
	x : 0,
	y : 0
};

function mouseMove(e){
	mouse.x = e.x;
	mouse.y = e.y;

	if(gameState == 2){
		drawPlayer();
		speed_bonus++;
		if(speed_bonus>(50/difficulty_bonus)){
			speed_bonus=0;
			score++;
		}
	}
}

function rightClickMenu(e){
	// Disables right click
	document.addEventListener("contextmenu", function(e){
	e.preventDefault();
	}, false);
	console.log(mouse.x, mouse.y);
}

function pause(){
	paused = !paused;
	if(paused){
		gameState = 6;
		var sounds = document.getElementsByTagName('audio');
  		for(i=0; i<sounds.length; i++) sounds[i].pause();

		canvas.requestPointerLock = canvas.requestPointerLock ||
                            	canvas.mozRequestPointerLock ||
                            	canvas.webkitRequestPointerLock;
                          
   		canvas.requestPointerLock();

		ctx.font = "30px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "#2497c1";
		ctx.fillText("PAUSE ", canvas.width/2, 200);
		ctx.fillText("Press Enter to exit or P to resume game", canvas.width/2, 250);
		document.getElementById('none').style.cursor = "none";
 
	}
	else{
		if(musicOp){
			var songPlay = document.getElementById("SFXGamePlay"+actual_difficulty+"_"+actual_song);
  			songPlay.play();
		}

		document.exitPointerLock = document.exitPointerLock ||
			   document.mozExitPointerLock ||
			   document.webkitExitPointerLock;
		document.exitPointerLock();

		document.getElementById('none').style.cursor = "none";
		gameState = 2;
	}
}

function initUpdates(){
	// Clean screen
	requestAnimationFrame(initUpdates);

	if(gameState == 2){
		if(!paused){
			//ctx.clearRect(0,0, canvas.width, canvas.height);
			ctx.drawImage(images[defaultBG], 0, 0, canvas.width+100, canvas.height+100);

			ctx.globalAlpha = 0.1;
			ctx.strokeStyle = "#FFF";
			ctx.fillStyle = "#061130";
			for(let i=0; i<4; i++){
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			}
			ctx.globalAlpha = 1.0;

			drawPlayer();
			ctx.fillStyle = '#FFF';

			var entLen = entities.length;
		  
			while(entLen--){
				entities[entLen].update();
			}

			tempScore++;
			if(tempScore>=50){
				score++;
				tempScore=0;
			}

			if(score%50 == 0 && tempScore==0){
				createCircle();
			}

			for(let j=0; j<meteors.length; j++){
				var meteor = meteors[j];

				if((mouse.x-user_size <= (meteor.x+meteor.radious-(meteor.radious/10)) && mouse.x+user_size >= meteor.x-meteor.radious+(meteor.radious/10)) && 
					(mouse.y-user_size <= (meteor.y+meteor.radious-(meteor.radious/10)) && mouse.y+user_size >= meteor.y-meteor.radious+(meteor.radious/10))){
					// Score
					ctx.textAlign = "center";
					if(meteor.id == 0){
						powerUp.time = 15;
						powerUp.name = "2x Score"
						powerUp.color = "#3AAF29";
						powerUp.enabled = true;
						if(soundOp){
							var songPlay = document.getElementById("SFXGood");
							songPlay.play();
						}
						score+=(5*power_probability);
					}
					// Lives
					else if(meteor.id == 1){
						powerUp.time = 15;
						powerUp.name = "+1 Live"
						powerUp.color = "#3AAF29";
						powerUp.enabled = true;
						if(soundOp){
							var songPlay = document.getElementById("SFXGood");
							songPlay.play();
						}
						number_of_lives++;
					}
					// Hits
					else if(meteor.id == 2){
						powerUp.time = 15;
						powerUp.name = "Hit reset"
						powerUp.color = "#3AAF29";
						powerUp.enabled = true;
						if(soundOp){
							var songPlay = document.getElementById("SFXGood");
							songPlay.play();
						}
						number_of_hits=0;
					}
					// Damage
					else if(meteor.id == 3){
						powerUp.time = 15;
						powerUp.name = "-1 Live"
						powerUp.color = "#9b0007";
						powerUp.enabled = true;
						damage = true;
						if(soundOp){
							var songPlay = document.getElementById("SFXBad");
							songPlay.play();
						}
						number_of_hits++;
						number_of_lives--;
					}
					meteors.splice(j, 1); 			// Removes meteor
					createCircle(); 				// Creates a new one
				}
				
				// If meteor leaves screen
				if(meteor.x -(meteor.radious)>=canvas.width || meteor.x+(meteor.radious)<=0 || 
					meteor.y-(meteor.radious)>=canvas.height || meteor.y+(meteor.radious)<=0){
					meteors.splice(j, 1); 		
					createCircle();
				}
				meteor.update(); 	// Update frames
			}

			// Updates labels
			ctx.font = "30px Arial";
			ctx.textAlign = "center";
			ctx.fillStyle = "#2497c1";
			ctx.fillText("Hits: "+number_of_hits, 60, 30);
			ctx.fillText("Lives: "+number_of_lives, 65, 60);
			ctx.fillText("Score: "+score.toFixed(0), 65, 90);

			if(powerUp.enabled) {
				// Paint label
				fontSize = 25-powerUp.time;
				ctx.font = fontSize+"px Arial";
				ctx.fillStyle = powerUp.color;
				ctx.fillText(powerUp.name, mouse.x, mouse.y-30);

				if(!powerUp.time--) {
					powerUp.enabled = false;
				}
			}
			// If user leaves screen
			if(mouse.x-user_size>=canvas.width || mouse.y+user_size<=0 || 
				mouse.y-user_size>=canvas.height || mouse.y+user_size<=0)
					endGame();

			// If there are no more lives left...
			if(number_of_lives<=0)
				endGame();
		}
	}
}

function endGame(){
	gameState = 3;
	meteors= [];
	entities= [];
	document.getElementById('none').style.cursor = "default";
	score *= difficulty_bonus;
	score = score.toFixed(2);
	score = parseFloat(score);
	temp = score;

	if(score > ScoresDB[4].score){
		newRecord();
	}

	else
		gameOver();
}


function gameOver(){
	gameState = 10;

	var img = new Image();
	img.src = backgrounds[defaultBG];
	img.onload = function(){
	// Initial text
	//ctx.clearRect(0,0, canvas.width, canvas.height);

	ctx.drawImage(img, 0, 0, canvas.width+100, canvas.height+100);

	var sounds = document.getElementsByTagName('audio');
 	for(i=0; i<sounds.length; i++) sounds[i].pause();
 	if(musicOp){
 		var songPlay = document.getElementById("SFXGameOver");
		songPlay.load();
		songPlay.play();
 	}

	ctx.font = "30px Arial";
	ctx.textAlign = "center";
	ctx.fillStyle = "#2497c1";
	//ctx.fillText("Perdiste! ", canvas.width/2, 50);

	ctx.font = "35px Magneto";
	ctx.textAlign = "center";

	ctx.fillStyle = "#3F47CE";
	ctx.fillText("!!Game Over¡¡", canvas.width/2, 75);
	ctx.fillStyle = "#E1CDB5";
	ctx.fillText("!!Game Over¡¡", canvas.width/2-3, 78);

	ctx.fillStyle = "#A46FE5";
	ctx.fillText("Score: "+score, canvas.width/2, 120);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("Score: "+score, canvas.width/2-3, 123);

	ctx.fillStyle = "#A46FE5";
	ctx.fillText("Hits: "+number_of_hits, canvas.width/2, 165);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("Hits: "+number_of_hits, canvas.width/2-3, 168);

	ctx.fillStyle = "#A46FE5";
	ctx.fillText("Press S to go to Menu", canvas.width/2, 255);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("Press S to go to Menu", canvas.width/2-3, 258);

	ctx.fillStyle = "#3F47CE";
	ctx.fillText("Press R to Retry", canvas.width/2, 300);
	ctx.fillStyle = "#E1CDB5";
	ctx.fillText("Press R to Retry", canvas.width/2-3, 303);
	}
}

function newRecord(){
	gameState = 9;

	var data="";
	username = "";
	$('#myModal').modal('show', function (event){});
}

function uploadRecord(data){
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();

	today = dd + '/' + mm + '/' + (yyyy+1023);

	var s = new ScoreText(score, difficulty_text[actual_difficulty], data, today);
	ScoresDB.push(s);

	var JSON_obj = JSON.stringify(ScoresDB);

	isStorage && localStorage.setItem("high-scores", JSON_obj);
	getConfigs();
	gameOver();
}

function startGame(difPar){
	actual_difficulty = difPar;

	var sounds = document.getElementsByTagName('audio');
 	for(i=0; i<sounds.length; i++) sounds[i].pause();
	if(musicOp){
		var songPlay = document.getElementsByName("songs"+actual_difficulty);
		var rand = songPlay[Math.floor(Math.random() * songPlay.length)];
		rand.load();
  		rand.play();
	}

	initStars();

	// Sets values depending on difficulty
	number_of_lives=  difficulty[actual_difficulty].lives;
	power_size= difficulty[actual_difficulty].pRadio;	
	meteor_size= difficulty[actual_difficulty].mRadio;
	user_size= difficulty[actual_difficulty].user_size;
	power_speed= difficulty[actual_difficulty].pSpeed;
	meteor_speed= difficulty[actual_difficulty].mSpeed;
	power_probability= difficulty[actual_difficulty].prob;
	difficulty_bonus= difficulty[actual_difficulty].multi;

	// Changes game mode to 2Players
	gameState = 2;
	score=0;
	number_of_hits=0;

	// Deletes cursor
	document.getElementById('none').style.cursor = "none";

	// Creates meteors
	for(let i=0; i<difficulty[actual_difficulty].initialQuantity; i++){
		createCircle();
	}

	// Updates colors
	if(!firstClick)
		initUpdates();	

	firstClick = true;
}

function viewScores(){
	gameState = 7;

	// To change cursor
	var t2 = setInterval(function(){ 
		var px = mouse.x;
		var py = mouse.y;
		if(gameState == 7){
			if((px >= 42 && px <= 98) && (py >= 33 && py <= 95))
					document.getElementById('none').style.cursor = "crosshair";
			else
				document.getElementById('none').style.cursor = "default";
		}
		else{
			document.getElementById('none').style.cursor = "default";
			clearInterval(t2);	
		}
	}, 50);

	// Cleans screen
	ctx.clearRect(0,0, canvas.width, canvas.height);

	var img = new Image();
	img.src = backgrounds[defaultBG];
	//img.onload = function(){
	ctx.drawImage(img, 0, 0, canvas.width+100, canvas.height+100);

	// Squares
	ctx.globalAlpha = 0.3;
	ctx.strokeStyle = "#FFF";
	ctx.fillStyle = "#061130";
	ctx.strokeRect(canvas.width/2-620, 100, canvas.width-650, canvas.height/2);
	ctx.fillRect(canvas.width/2-620, 100, canvas.width-650, canvas.height/2);
	ctx.globalAlpha = 1.0;

	ctx.font = "80px Magneto";
	ctx.textAlign = "center";
	
	ctx.fillStyle = "#3F47CE";
	ctx.fillText("S", canvas.width/2-110, 75);
	ctx.fillStyle = "#A46FE5";
	ctx.fillText("cores", canvas.width/2+45, 75);

	ctx.fillStyle = "#E1CDB5";
	ctx.fillText("S", canvas.width/2-115, 80);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("cores", canvas.width/2+40, 80);

	getConfigs();
	ctx.font = "25px Arial";

	ctx.fillStyle = "#db683e";
	ctx.textAlign = "left";
	ctx.fillText("Place", canvas.width/2-580, 135);
	ctx.fillText("Score", canvas.width/2-450, 135);
	ctx.fillText("Difficulty", canvas.width/2-250, 135);
	ctx.fillText("Username", canvas.width/2+50, 135);
	ctx.fillText("Date", canvas.width/2+400, 135);

	ctx.fillStyle = "#2497c1";
	for(let i=0; i<ScoresDB.length; i++){
		ctx.strokeStyle = "#FFF";
		ctx.fillText((i+1)+".- ", canvas.width/2-580, 175+(i*60));
		ctx.fillText(ScoresDB[i].score, canvas.width/2-450, 175+(i*60));
		ctx.fillText(ScoresDB[i].difficulty, canvas.width/2-250, 175+(i*60));
		ctx.fillText(ScoresDB[i].user, canvas.width/2+50, 175+(i*60));
		ctx.fillText(ScoresDB[i].date, canvas.width/2+400, 175+(i*60));
		//console.log(ScoresDB);
	}

	ctx.strokeStyle = "#FFF";
	ctx.strokeRect(40, 30, 50, 50);
	ctx.fillText("<", 65, 65);
	//}
}

function selectConfig(){
	gameState = 5;

	// Change cursor
	var t2 = setInterval(function(){ 
		var px = mouse.x;
		var py = mouse.y;
		if(gameState == 5){
			// Menu
			if(((px >= 42 && px <= 98) && (py >= 33 && py <= 95)) || 
				// Music & Sound
				((px >= canvas.width/2-440 && px <= canvas.width/2-340) 
				&& (py >= 320 && py <= 370))  ||
				((px >= canvas.width/2-440 && px <= canvas.width/2-340) 
				&& (py >= 410 && py <= 460)) ||
				// User Color
				((px >= canvas.width/2-310 && px <= canvas.width/2-270) 
				&& (py >= 630 && py <= 670)) ||
				((px >= canvas.width/2-210 && px <= canvas.width/2-170) 
				&& (py >= 630 && py <= 670)) ||
				((px >= canvas.width/2-110 && px <= canvas.width/2-70)  
				&& (py >= 630 && py <= 670)) ||
				((px >= canvas.width/2-10 && px <= canvas.width/2+30)  
				&& (py >= 630 && py <= 670)) ||
				((px >= canvas.width/2+90 && px <= canvas.width/2+130)  
				&& (py >= 630 && py <= 670)) ||
				// Background
				((px >= canvas.width/2-391 && px <= canvas.width/2-291) && 
					(py >= canvas.height/2+40 && py <= canvas.height/2+30+109)) ||
				((px >= canvas.width/2-191 && px <= canvas.width/2-91) && 
					(py >= canvas.height/2+40 && py <= canvas.height/2+30+109)) ||
				((px >= canvas.width/2+9 && px <= canvas.width/2+109) && 
					(py >= canvas.height/2+40 && py <= canvas.height/2+30+109)) ||
				((px >= canvas.width/2+209 && px <= canvas.width/2+309) && 
					(py >= canvas.height/2+40 && py <= canvas.height/2+30+109)) ||
				((px >= canvas.width/2+409 && px <= canvas.width/2+509) && 
					(py >= canvas.height/2+40 && py <= canvas.height/2+30+109)))
					document.getElementById('none').style.cursor = "crosshair";

			else
				document.getElementById('none').style.cursor = "default";
		}
		else{
			document.getElementById('none').style.cursor = "default";
			clearInterval(t2);	
		}
	}, 50);

	ctx.clearRect(0,0, canvas.width, canvas.height);

	var img = new Image();
	img.src = backgrounds[defaultBG];
	//img.onload = function(){
	ctx.drawImage(img, 0, 0, canvas.width+100, canvas.height+100);

	// TITLE
	ctx.font = "80px Magneto";
	ctx.textAlign = "center";
	
	ctx.fillStyle = "#3F47CE";
	ctx.fillText("S", canvas.width/2-145, 75);
	ctx.fillStyle = "#A46FE5";
	ctx.fillText("ettings", canvas.width/2+45, 75);

	ctx.fillStyle = "#E1CDB5";
	ctx.fillText("S", canvas.width/2-150, 80);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("ettings", canvas.width/2+40, 80);

	// MUSIC
	ctx.fillStyle = "#2497c1";
	ctx.strokeStyle = "#FFF";
	ctx.font = "35px Magneto";
	ctx.textAlign = "center";
	

	ctx.fillStyle = "#3F47CE";
	ctx.fillText("M", canvas.width/2-580, canvas.height/2-120);
	ctx.fillStyle = "#A46FE5";
	ctx.fillText("usic:", canvas.width/2-510, canvas.height/2-120);

	ctx.fillStyle = "#E1CDB5";
	ctx.fillText("M", canvas.width/2-585, canvas.height/2-118);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("usic:", canvas.width/2-515, canvas.height/2-118);

	// SQUARES
	ctx.globalAlpha = 0.3;
	ctx.strokeStyle = "#FFF";
	ctx.fillStyle = "#061130";
	for(let i=0; i<2; i++){
		ctx.strokeRect(canvas.width/2-450, (i*90+310), 100, 50);
		ctx.fillRect(canvas.width/2-450, (i*90+310), 100, 50);
	}
	ctx.globalAlpha = 1.0;

	ctx.font = "30px Arial";
	ctx.textAlign = "center";
	ctx.fillStyle = "#2497c1";

	//ctx.strokeRect(canvas.width/2-(canvas.width/2-220), 150, 100, 50);
	ctx.textAlign = "center";
	if(musicOp)	
		ctx.fillText("On", canvas.width/2-400, 345);
	else
		ctx.fillText("Off", canvas.width/2-400, 345);

	// SOUNDS
	ctx.fillStyle = "#2497c1";
	ctx.strokeStyle = "#FFF";
	ctx.font = "35px Magneto";
	ctx.textAlign = "center";
	
	ctx.fillStyle = "#3F47CE";
	ctx.fillText("S", canvas.width/2-580, canvas.height/2-26);
	ctx.fillStyle = "#A46FE5";
	ctx.fillText("ounds:", canvas.width/2-510, canvas.height/2-26);

	ctx.fillStyle = "#E1CDB5";
	ctx.fillText("S", canvas.width/2-585, canvas.height/2-24);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("ounds:", canvas.width/2-515, canvas.height/2-24);

	ctx.font = "30px Arial";
	ctx.textAlign = "center";
	ctx.fillStyle = "#2497c1";

	ctx.textAlign = "left";
	ctx.strokeStyle = "#FFF";
	ctx.textAlign = "center";
	if(soundOp)	
		ctx.fillText("On", canvas.width/2-400, 440);
	else
		ctx.fillText("Off", canvas.width/2-400, 440);

	// BACKGROUND
	ctx.fillStyle = "#2497c1";
	ctx.strokeStyle = "#FFF";
	ctx.font = "35px Magneto";
	ctx.textAlign = "center";
	
	ctx.fillStyle = "#3F47CE";
	ctx.fillText("S", canvas.width/2-580, canvas.height/2+71);
	ctx.fillStyle = "#A46FE5";
	ctx.fillText("cene:", canvas.width/2-510, canvas.height/2+71);

	ctx.fillStyle = "#E1CDB5";
	ctx.fillText("S", canvas.width/2-585, canvas.height/2+73);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("cene:", canvas.width/2-515, canvas.height/2+73);

	ctx.textAlign = "left";
	ctx.strokeStyle = "#FFF";

	// PLAYER COLOR
	ctx.fillStyle = "#2497c1";
	ctx.strokeStyle = "#FFF";
	ctx.font = "35px Magneto";
	ctx.textAlign = "center";
	
	ctx.fillStyle = "#3F47CE";
	ctx.fillText("P", canvas.width/2-580, canvas.height/2+181);
	ctx.fillStyle = "#A46FE5";
	ctx.fillText("layer color:", canvas.width/2-450, canvas.height/2+181);

	ctx.fillStyle = "#E1CDB5";
	ctx.fillText("P", canvas.width/2-585, canvas.height/2+183);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("layer color:", canvas.width/2-455, canvas.height/2+183);

	ctx.strokeStyle = "#FFF";

	ctx.beginPath();
	ctx.arc(canvas.width/2-300, 640, 20, 0, Math.PI*2, false);
	ctx.fillStyle = "#3AAF29";
	ctx.fill();
	if(idColor == 0){
		ctx.strokeStyle = "Red";
		ctx.arc(canvas.width/2-300, 640, 20, 0, Math.PI*2, false);
		ctx.stroke();
	}

	ctx.beginPath();
	ctx.arc(canvas.width/2-200, 640, 20, 0, Math.PI*2, false);
	ctx.fillStyle = "#35CAAC";
	ctx.fill();
	if(idColor == 1){
		ctx.strokeStyle = "Red";
		ctx.arc(canvas.width/2-200, 640, 20, 0, Math.PI*2, false);
		ctx.stroke();
	}

	ctx.beginPath();
	ctx.arc(canvas.width/2-100, 640, 20, 0, Math.PI*2, false);
	ctx.fillStyle = "#2522F4";
	ctx.fill();
	if(idColor == 2){
		ctx.strokeStyle = "Red";
		ctx.arc(canvas.width/2-100, 640, 20, 0, Math.PI*2, false);
		ctx.stroke();
	}

	ctx.beginPath();
	ctx.arc(canvas.width/2, 640, 20, 0, Math.PI*2, false);
	ctx.fillStyle = "#5A11B2";
	ctx.fill();
	if(idColor == 3){
		ctx.strokeStyle = "Red";
		ctx.arc(canvas.width/2, 640, 20, 0, Math.PI*2, false);
		ctx.stroke();
	}

	ctx.beginPath();
	ctx.arc(canvas.width/2+100, 640, 20, 0, Math.PI*2, false);
	ctx.fillStyle = "#C63B98";
	ctx.fill();
	if(idColor == 4){
		ctx.strokeStyle = "Red";
		ctx.arc(canvas.width/2+100, 640, 20, 0, Math.PI*2, false);
		ctx.stroke();
	}

	ctx.fillStyle = "#2497c1";
	ctx.strokeStyle = "#FFF";
	ctx.strokeRect(40, 30, 50, 50);
	ctx.fillText("<", 65, 65);

	ctx.strokeStyle = "#FFF";
	if(defaultBG == 0)
		ctx.strokeRect(canvas.width/2-401, canvas.height/2+30, 101, 101);
	else if(defaultBG == 1)
		ctx.strokeRect(canvas.width/2-201, canvas.height/2+30, 101, 101);
	else if(defaultBG == 2)
		ctx.strokeRect(canvas.width/2-1, canvas.height/2+30, 101, 101);
	else if(defaultBG == 3)
		ctx.strokeRect(canvas.width/2+199, canvas.height/2+30, 101, 101);
	else if(defaultBG == 4)
		ctx.strokeRect(canvas.width/2+399, canvas.height/2+30, 101, 101);

	ctx.drawImage(images[0], canvas.width/2-400, canvas.height/2+30, 100, 100);
	ctx.drawImage(images[1], canvas.width/2-200, canvas.height/2+30, 100, 100);
	ctx.drawImage(images[2], canvas.width/2, canvas.height/2+30, 100, 100);
	ctx.drawImage(images[3], canvas.width/2+200, canvas.height/2+30, 100, 100);
	ctx.drawImage(images[4], canvas.width/2+400, canvas.height/2+30, 100, 100);
	//}
}

function mode1J(){
	gameState = 1;
	meteors= [];

	// Clean Screen
	ctx.fillStyle = "#000";
	ctx.clearRect(0,0, canvas.width, canvas.height);

	// Change Cursor
	var t2 = setInterval(function(){ 
		var px = mouse.x;
		var py = mouse.y;
		if(gameState == 1){
			if(((px >= canvas.width/2-110 && px <= canvas.width/2+130) && (py >= 160 && py <= 205)) ||
				((px >= canvas.width/2-110 && px <= canvas.width/2+130) && (py >= 260 && py <= 305)) ||
				((px >= canvas.width/2-110 && px <= canvas.width/2+130) && (py >= 360 && py <= 405)) ||
				((px >= canvas.width/2-110 && px <= canvas.width/2+130) && (py >= 460 && py <= 505)) ||
				((px >= 42 && px <= 98) && (py >= 33 && py <= 95)))
					document.getElementById('none').style.cursor = "crosshair";
			else
				document.getElementById('none').style.cursor = "default";
		}
		else{
			clearInterval(t2);	
			if(gameState == 0)
				document.getElementById('none').style.cursor = "default";
			else
				document.getElementById('none').style.cursor = "none";
		}
	}, 50);

	var img = new Image();
	img.src = backgrounds[defaultBG];
	//img.onload = function(){
	ctx.drawImage(img, 0, 0, canvas.width+100, canvas.height+100);

	ctx.font = "100px Magneto";
	ctx.textAlign = "center";

	ctx.fillStyle = "#A46FE5";
	ctx.fillText("Meteo", canvas.width/2-110, 100);
	ctx.fillStyle = "#3F47CE";
	ctx.fillText("R", canvas.width/2+105, 100);
	ctx.fillStyle = "#A46FE5";
	ctx.fillText("un", canvas.width/2+215, 100);

	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("Meteo", canvas.width/2-115, 108);
	ctx.fillStyle = "#E1CDB5";
	ctx.fillText("R", canvas.width/2+100, 108);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("un", canvas.width/2+210, 108);

	// Difficulties
	ctx.font = "25px Magneto";
	ctx.textAlign = "center";

	// SQUARES
	ctx.globalAlpha = 0.3;
	ctx.strokeStyle = "#FFF";
	ctx.fillStyle = "#061130";
	for(let i=0; i<4; i++){
		ctx.strokeRect(canvas.width/2-120, 150+(i*100), 240, 50);
		ctx.fillRect(canvas.width/2-120, 150+(i*100), 240, 50);
	}
	ctx.globalAlpha = 1.0;

	// 1 Player Mode
	ctx.strokeStyle = "#FFF";
	ctx.strokeRect(canvas.width/2-120, 150, 240, 50);	
	ctx.fillStyle = "#A46FE5";
	ctx.fillText("Noob", canvas.width/2, 185);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("Noob", canvas.width/2-2, 185+2);

	ctx.strokeStyle = "#FFF";
	ctx.strokeRect(canvas.width/2-120, 250, 240, 50);	
	ctx.fillStyle = "#A46FE5";	
	ctx.fillText("Ez", canvas.width/2, 285);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("Ez", canvas.width/2-2, 285+2);

	ctx.strokeStyle = "#FFF";
	ctx.strokeRect(canvas.width/2-120, 350, 240, 50);	
	ctx.fillStyle = "#A46FE5";
	ctx.fillText("Respect", canvas.width/2, 385);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("Respect", canvas.width/2-2, 385+2);

	ctx.strokeStyle = "#FFF";
	ctx.strokeRect(canvas.width/2-120, 450, 240, 50);	
	ctx.fillStyle = "#A46FE5";
	ctx.fillText("Pro", canvas.width/2, 485);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("Pro", canvas.width/2-2, 485+2);

	ctx.strokeStyle = "#FFF";
	ctx.strokeRect(40, 30, 50, 50);
	ctx.fillText("<", 65, 65);
	//}
}

function Menu(){
	gameState = 0;
	document.getElementById('none').style.cursor = "default";

	// Change cursor
	var t2 = setInterval(function(){ 
		var px = mouse.x;
		var py = mouse.y;
		if(gameState == 0){
			if(((px >= canvas.width/2-110 && px <= canvas.width/2+130) && (py >= 160 && py <= 205)) ||
				((px >= canvas.width/2-110 && px <= canvas.width/2+130) && (py >= 360 && py <= 405)) ||
				((px >= canvas.width/2-110 && px <= canvas.width/2+130) && (py >= 460 && py <= 505)))
					document.getElementById('none').style.cursor = "crosshair";
			else
				document.getElementById('none').style.cursor = "default";
		}
		else{
			document.getElementById('none').style.cursor = "default";
			clearInterval(t2);	
		}
	}, 50);


	// Cleans screen
	ctx.fillStyle = "#000";

	var img = new Image();
	img.src = backgrounds[defaultBG];
	ctx.drawImage(img, 0, 0, canvas.width+100, canvas.height+100);

	ctx.font = "100px Magneto";
	ctx.textAlign = "center";

	ctx.fillStyle = "#A46FE5";
	ctx.fillText("Meteo", canvas.width/2-110, 100);
	ctx.fillStyle = "#3F47CE";
	ctx.fillText("R", canvas.width/2+105, 100);
	ctx.fillStyle = "#A46FE5";
	ctx.fillText("un", canvas.width/2+215, 100);

	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("Meteo", canvas.width/2-115, 108);
	ctx.fillStyle = "#E1CDB5";
	ctx.fillText("R", canvas.width/2+100, 108);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("un", canvas.width/2+210, 108);

	// Options
	ctx.font = "25px Magneto";
	ctx.textAlign = "center";

	// SQUARES
	ctx.globalAlpha = 0.3;
	ctx.strokeStyle = "#FFF";
	ctx.fillStyle = "#061130";
	for(let i=0; i<4; i++){
		ctx.strokeRect(canvas.width/2-120, 150+(i*100), 240, 50);
		ctx.fillRect(canvas.width/2-120, 150+(i*100), 240, 50);
	}
	ctx.globalAlpha = 1.0;

	// 1 Player game mode
	ctx.strokeStyle = "#FFF";
	ctx.strokeRect(canvas.width/2-120, 150, 240, 50);	

	ctx.fillStyle = "#A46FE5";
	ctx.fillText("1 Player", canvas.width/2, 185);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("1 Player", canvas.width/2-2, 185+2);

	ctx.fillStyle = "#145268";
	// 2 Players game mode
	ctx.strokeStyle = "#FFF";
	ctx.strokeRect(canvas.width/2-120, 250, 240, 50);	
	ctx.fillText("2 Players", canvas.width/2, 285);

	// Settings
	ctx.strokeRect(canvas.width/2-120, 350, 240, 50);	
	ctx.fillStyle = "#A46FE5";
	ctx.fillText("Settings", canvas.width/2, 385);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("Settings", canvas.width/2-2, 385+2);

	// Scores
	ctx.strokeRect(canvas.width/2-120, 450, 240, 50);
	ctx.fillStyle = "#A46FE5";
	ctx.fillText("Scores", canvas.width/2, 485);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("Scores", canvas.width/2-2, 485+2);

	// Credits
	ctx.font = "15px Sans";
	ctx.strokeStyle = "#FFF";	
	ctx.fillText("Credits: Roberto Sevilla", 85, canvas.height-20);
	//}
}

function StartMenu(){
	gameState = 11;
	document.getElementById('none').style.cursor = "default";

	// Change cursor
	var t2 = setInterval(function(){ 
		var px = mouse.x;
		var py = mouse.y;
		if(gameState == 11){
			if((px >= canvas.width/2-110 && px <= canvas.width/2+130) && (py >= 260 && py <= 305))
					document.getElementById('none').style.cursor = "crosshair";
			else
				document.getElementById('none').style.cursor = "default";
		}
		else{
			document.getElementById('none').style.cursor = "default";
			clearInterval(t2);	
		}
	}, 50);


	// Clean Screen
	ctx.fillStyle = "#000";

	var img = new Image();
	img.src = backgrounds[defaultBG];
	img.onload = function(){
	ctx.drawImage(img, 0, 0, canvas.width+100, canvas.height+100);

	ctx.font = "100px Magneto";
	ctx.textAlign = "center";

	ctx.fillStyle = "#A46FE5";
	ctx.fillText("Meteo", canvas.width/2-110, 100);
	ctx.fillStyle = "#3F47CE";
	ctx.fillText("R", canvas.width/2+105, 100);
	ctx.fillStyle = "#A46FE5";
	ctx.fillText("un", canvas.width/2+215, 100);

	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("Meteo", canvas.width/2-115, 108);
	ctx.fillStyle = "#E1CDB5";
	ctx.fillText("R", canvas.width/2+100, 108);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("un", canvas.width/2+210, 108);

	// Options
	ctx.font = "25px Magneto";
	ctx.textAlign = "center";

	// SQUARES
	ctx.globalAlpha = 0.3;
	ctx.strokeStyle = "#FFF";
	ctx.fillStyle = "#061130";
	ctx.strokeRect(canvas.width/2-120, 250, 240, 50);
	ctx.fillRect(canvas.width/2-120, 250, 240, 50);
	ctx.globalAlpha = 1.0;

	// 1 Player game mode
	ctx.strokeStyle = "#FFF";
	ctx.strokeRect(canvas.width/2-120, 250, 240, 50);	

	ctx.fillStyle = "#A46FE5";
	ctx.fillText("Start Game", canvas.width/2, 285);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("Start Game", canvas.width/2-2, 285+2);

	// Credits
	ctx.font = "15px Sans";
	ctx.strokeStyle = "#FFF";	
	ctx.fillText("Credits: Roberto Sevilla", 85, canvas.height-20);
	}
}

function init(){
	// Creates canvas
	canvas = document.getElementById('my-canvas');
	canvas.height = window.innerHeight-10;
	canvas.width = window.innerWidth-10;
	ctx = canvas.getContext("2d");

	// Score
    $(document).ready(function(){
		$('#buttonAccept').click(function(){
			var name = document.getElementById('InputUsername');
			uploadRecord(name.value);
		})
	})

	var JSON_obj = JSON.stringify(1);
	
	// Updates scores and accepts inputs
	getConfigs();
	inputs();
	preloadimages();

	// Checks if is first time or not
	if(!localStorage.getItem('high-scores')) {
		setDefaultScores();
	}

	// Runs Main Menu
	StartMenu();
	//Menu();
}


/*********************************** Uploads windows ***********************************/
window.onmousemove = mouseMove;
window.onauxclick = rightClickMenu;
window.onload= init;