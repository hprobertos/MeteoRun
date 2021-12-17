
// User variables
var number_of_hits = 0; 						
var number_of_lives = 1; 						
var tempScore = 0; 					
var score = 0; 						
var hurtTim = 0;
var damage = false;
var colortim = 1;
var offColor = 0;

// List of colors
var userColor = [
	"#3AAF29", 				// Default Green
	"#35CAAC", 				// Light Blue
	"#2522F4", 				// Dark Blue
	"#5A11B2", 				// Purple
	"#C63B98", 				// Pink

	"#9b0007","#9b0007","#9b0007","#9b0007","#9b0007"
	//"#26751A", 				// Default Green
	//"#1C6D5D", 				// Light Blue
	//"#110F70", 				// Dark Blue
	//"#2A0854", 				// Purple
	//"#5E1B48" 				// Pink
];

function drawPlayer(){
	if(damage == true || hurtTim > 0){
		damage = false;
 		hurtTim++;
 		if(hurtTim%10 == 0 && colortim==1){
			offColor=5;	
			colortim*=-1;
		}
		else if(hurtTim%10 == 0 && colortim==-1){
			offColor=0;	
			colortim*=-1;
		}
		if(hurtTim==100){
			hurtTim=0;
			offColor=0;
		}
	}

	ctx.beginPath();
	ctx.arc(mouse.x, mouse.y, user_size, 0, Math.PI*2, false);
	ctx.shadowBlur = 10;
	ctx.shadowColor = userColor[idColor+offColor];
	ctx.fillStyle = userColor[idColor+offColor];
	ctx.fill();
	ctx.shadowBlur = 0;
}

function leftClickMenu(e){
	
	var position_x = e.x;
	var position_y = e.y;

	// If the game started...
	if(gameState == 2){
		leftClickGame(position_x,position_y);
	}

	// Select game mode or Settings
	else if(gameState == 0){
		400, 150, 200, 50
		if((position_x >= canvas.width/2-110 && position_x <= canvas.width/2+130) && (position_y >= 160 && position_y <= 205)) 		mode1J(); 							

		else if((position_x >= canvas.width/2-110 && position_x <= canvas.width/2+130) && (position_y >= 260 && position_y <= 305)){ 	// Starts 2P gamemode
			//actual_difficulty=1;
			//gameState = 2;
			//document.getElementById('none').style.cursor = "none";
			//startGame(); 
		} 

		else if((position_x >= canvas.width/2-110 && position_x <= canvas.width/2+130) && (position_y >= 360 && position_y <= 405)) 	selectConfig();

		else if((position_x >= canvas.width/2-110 && position_x <= canvas.width/2+130) && (position_y >= 460 && position_y <= 505))	viewScores();
	}

	// Selects difficulty
	else if(gameState == 1){
		if((position_x >= canvas.width/2-110 && position_x <= canvas.width/2+130) && (position_y >= 160 && position_y <= 205)) 		startGame(0); 			
		else if((position_x >= canvas.width/2-110 && position_x <= canvas.width/2+130) && (position_y >= 260 && position_y <= 305)) 	startGame(1); 
		else if((position_x >= canvas.width/2-110 && position_x <= canvas.width/2+130) && (position_y >= 360 && position_y <= 405)) 	startGame(2);	 
		else if((position_x >= canvas.width/2-110 && position_x <= canvas.width/2+130) && (position_y >= 460 && position_y <= 505)) 	startGame(3);	
		else if((position_x >= 42 && position_x <= 98) && (position_y >= 33 && position_y <= 95)) 		Menu();	
	}

	// Selects settings
	else if(gameState == 5){
		if((position_x >= 42 && position_x <= 98) && (position_y >= 33 && position_y <= 95)) 			
			Menu();
		else if((position_x >= canvas.width/2-440 && position_x <= canvas.width/2-340) 
			&& (position_y >= 320 && position_y <= 370)) 	
			changeMusic();
		else if((position_x >= canvas.width/2-440 && position_x <= canvas.width/2-340) 
			&& (position_y >= 410 && position_y <= 460)) 	
			changeAudio();
		else if((position_x >= canvas.width/2-310 && position_x <= canvas.width/2-270) 
			&& (position_y >= 630 && position_y <= 670)) 	
			{changeUserColor(0);}
		else if((position_x >= canvas.width/2-210 && position_x <= canvas.width/2-170) 
			&& (position_y >= 630 && position_y <= 670)) 	
			{changeUserColor(1);}
		else if((position_x >= canvas.width/2-110 && position_x <= canvas.width/2-70) 
			&& (position_y >= 630 && position_y <= 670)) 	
			{changeUserColor(2);}
		else if((position_x >= canvas.width/2-10 && position_x <= canvas.width/2+30) 
			&& (position_y >= 630 && position_y <= 670)) 	
			{changeUserColor(3);}
		else if((position_x >= canvas.width/2+90 && position_x <= canvas.width/2+130) 
			&& (position_y >= 630 && position_y <= 670)) 	
			{changeUserColor(4);}
		else if((position_x >= canvas.width/2-391 && position_x <= canvas.width/2-291) && 
			(position_y >= canvas.height/2+40 && position_y <= canvas.height/2+30+109))
			{changeBackground(0);}
		else if((position_x >= canvas.width/2-191 && position_x <= canvas.width/2-91) && 
			(position_y >= canvas.height/2+40 && position_y <= canvas.height/2+30+109))
			{changeBackground(1);}
		else if((position_x >= canvas.width/2+9 && position_x <= canvas.width/2+109) && 
			(position_y >= canvas.height/2+40 && position_y <= canvas.height/2+30+109))
			{changeBackground(2);}
		else if((position_x >= canvas.width/2+209 && position_x <= canvas.width/2+309) && 
			(position_y >= canvas.height/2+40 && position_y <= canvas.height/2+30+109))
			{changeBackground(3);}
		else if((position_x >= canvas.width/2+409 && position_x <= canvas.width/2+509) && 
			(position_y >= canvas.height/2+40 && position_y <= canvas.height/2+30+109))
			{changeBackground(4);}

	}

	// Select viewScores
	else if(gameState == 7){
		if((position_x >= 42 && position_x <= 98) && (position_y >= 33 && position_y <= 95)) 			Menu();
	}

	// Selects gamemode or Settings
	else if(gameState == 11){
		if((position_x >= canvas.width/2-110 && position_x <= canvas.width/2+130) && (position_y >= 260 && position_y <= 305)){
			if(musicOp){
				var songPlay = document.getElementById("SFXMainMenu");
		  		songPlay.play();
			}
			Menu();
		} 							
	}
}

function leftClickGame(px,py){
	// TODO
}

function rightClickGame(){
	// TODO
}

function inputs(){
		document.onkeypress = function(evt){
		evt = evt || window.event;
		var charcode = evt.keyCode || evt.which;
		var keyPressed = String.fromCharCode(charcode);
		
		if(gameState == 10){
			if(keyPressed == 's' || keyPressed == 'S'){
				var sounds = document.getElementsByTagName('audio');
  				for(i=0; i<sounds.length; i++) sounds[i].pause();
  				var songPlay = document.getElementById("SFXMainMenu");
				songPlay.load();
		  		songPlay.play();
  				Menu();
			}
			else if(keyPressed == 'r' || keyPressed == 'R'){
				var sounds = document.getElementsByTagName('audio');
  				for(i=0; i<sounds.length; i++) sounds[i].pause();
  				startGame(actual_difficulty); 
			}
		}
		else if(gameState == 2 || gameState == 6){
			if(keyPressed == 'p' || keyPressed == 'P')
				pause();
			else if(charcode == 13 && gameState == 6){
				paused = false;
				document.exitPointerLock = document.exitPointerLock ||
				   document.mozExitPointerLock ||
				   document.webkitExitPointerLock;
				document.exitPointerLock();
				Menu();
			}	
		}
	}
}

window.onclick = leftClickMenu;