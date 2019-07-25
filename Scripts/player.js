
// Variables de opciones del jugador
var hits=0; 						// Determina el número de veces que te golpearon
var lives=1; 						// Determina el número de vidas que cuenta el jugador
var tempScore=0; 					// Variable de apoyo para el score
var score=0; 						// Variable que tiene el score
var hurtTim=0;
var damage=false;
var colortim=1;
var offColor=0;

// Lista de Colores
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

// Lista de Colores Oscuros
var userColorHurt = [

];

/*****************************  FUNCION DE PINTA CUADRITO  **********************************/
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
	ctx.arc(mouse.x, mouse.y, uRadio, 0, Math.PI*2, false);
	ctx.shadowBlur = 10;
	ctx.shadowColor = userColor[idColor+offColor];
	ctx.fillStyle = userColor[idColor+offColor];
	ctx.fill();
	ctx.shadowBlur = 0;
}

/********************************  FUNCION DE CLICK IZQUIERDO  **********************************/
function clickIzquierdoMenu(e){
	// Hace variables la posicion del botonazo
	var px = e.x;
	var py = e.y;

	// Si el juego ya inició...
	if(gameStatus == 2){
		clickIzquierdoGame(px,py);
	}

	// Selecciona el modo de Juego o Configuracion
	else if(gameStatus==0){
		400, 150, 200, 50
		if((px >= canvas.width/2-110 && px <= canvas.width/2+130) && (py >= 160 && py <= 205)) 		mode1J(); 							

		else if((px >= canvas.width/2-110 && px <= canvas.width/2+130) && (py >= 260 && py <= 305)){ 	// Iniciar juego en 2J
			//dif=1;
			//gameStatus = 2;
			//document.getElementById('none').style.cursor = "none";
			//startGame(); 
		} 

		else if((px >= canvas.width/2-110 && px <= canvas.width/2+130) && (py >= 360 && py <= 405)) 	selectConfig();

		else if((px >= canvas.width/2-110 && px <= canvas.width/2+130) && (py >= 460 && py <= 505))	viewScores();
	}

	// Selecciona la dificultad en 1J 
	else if(gameStatus==1){
		if((px >= canvas.width/2-110 && px <= canvas.width/2+130) && (py >= 160 && py <= 205)) 		startGame(0); 			
		else if((px >= canvas.width/2-110 && px <= canvas.width/2+130) && (py >= 260 && py <= 305)) 	startGame(1); 
		else if((px >= canvas.width/2-110 && px <= canvas.width/2+130) && (py >= 360 && py <= 405)) 	startGame(2);	 
		else if((px >= canvas.width/2-110 && px <= canvas.width/2+130) && (py >= 460 && py <= 505)) 	startGame(3);	
		else if((px >= 42 && px <= 98) && (py >= 33 && py <= 95)) 		Menu();	
	}

	// Seleccionar Configuraciones
	else if(gameStatus == 5){
		if((px >= 42 && px <= 98) && (py >= 33 && py <= 95)) 			Menu();
		else if((px >= canvas.width/2-(canvas.width/2-230) && px <= canvas.width/2-(canvas.width/2-330)) 
			&& (py >= 153 && py <= 205)) 	
			changeMusic();
		else if((px >= canvas.width/2-(canvas.width/2-230) && px <= canvas.width/2-(canvas.width/2-330)) 
			&& (py >= 253 && py <= 305)) 	
			changeAudio();
		else if((px >= canvas.width/2-(canvas.width/2-80) && px <= canvas.width/2-(canvas.width/2-120)) 
			&& (py >= 510 && py <= 550)) 	
			{changeUserColor(0);}
		else if((px >= canvas.width/2-(canvas.width/2-150) && px <= canvas.width/2-(canvas.width/2-190)) 
			&& (py >= 510 && py <= 550)) 	
			{changeUserColor(1);}
		else if((px >= canvas.width/2-(canvas.width/2-220) && px <= canvas.width/2-(canvas.width/2-270)) 
			&& (py >= 510 && py <= 550)) 	
			{changeUserColor(2);}
		else if((px >= canvas.width/2-(canvas.width/2-290) && px <= canvas.width/2-(canvas.width/2-350)) 
			&& (py >= 510 && py <= 550)) 	
			{changeUserColor(3);}
		else if((px >= canvas.width/2-(canvas.width/2-360) && px <= canvas.width/2-(canvas.width/2-430)) 
			&& (py >= 510 && py <= 550)) 	
			{changeUserColor(4);}
		else if((px >= canvas.width/2-391 && px <= canvas.width/2-291) && 
			(py >= canvas.height/2+40 && py <= canvas.height/2+30+109))
			{changeBackground(0);}
		else if((px >= canvas.width/2-191 && px <= canvas.width/2-91) && 
			(py >= canvas.height/2+40 && py <= canvas.height/2+30+109))
			{changeBackground(1);}
		else if((px >= canvas.width/2+9 && px <= canvas.width/2+109) && 
			(py >= canvas.height/2+40 && py <= canvas.height/2+30+109))
			{changeBackground(2);}
		else if((px >= canvas.width/2+209 && px <= canvas.width/2+309) && 
			(py >= canvas.height/2+40 && py <= canvas.height/2+30+109))
			{changeBackground(3);}
		else if((px >= canvas.width/2+409 && px <= canvas.width/2+509) && 
			(py >= canvas.height/2+40 && py <= canvas.height/2+30+109))
			{changeBackground(4);}

	}

	// Seleccionar ViewScores
	else if(gameStatus == 7){
		if((px >= 42 && px <= 98) && (py >= 33 && py <= 95)) 			Menu();
	}

		// Selecciona el modo de Juego o Configuracion
	else if(gameStatus==11){
		if((px >= canvas.width/2-110 && px <= canvas.width/2+130) && (py >= 260 && py <= 305)){
			if(musicOp){
				var songPlay = document.getElementById("SFXMainMenu");
		  		songPlay.play();
			}
			Menu();
		} 							
	}
}


/******************************  FUNCION DE CLICK IZQUIERDO EN JUEGO  **********************************/
function clickIzquierdoGame(px,py){

}

/********************************  FUNCION DE CLICK DERECHO  **********************************/
function clickDerechoGame(){
	// Si el juego ya inició, cambia color de cuadrito
	/*if(gameOn){
		currentColor = getRandomColor();
	}*/
}

function inputs(){
		document.onkeypress = function(evt){
		evt = evt || window.event;
		var charcode = evt.keyCode || evt.which;
		var charStr = String.fromCharCode(charcode);
		
		if(gameStatus==10){
			if(charStr == 's' || charStr == 'S'){
				var sounds = document.getElementsByTagName('audio');
  				for(i=0; i<sounds.length; i++) sounds[i].pause();
  				var songPlay = document.getElementById("SFXMainMenu");
				songPlay.load();
		  		songPlay.play();
  				Menu();
			}
			else if(charStr == 'r' || charStr == 'R'){
				var sounds = document.getElementsByTagName('audio');
  				for(i=0; i<sounds.length; i++) sounds[i].pause();
  				startGame(dif); 
			}
		}
		else if(gameStatus==2 || gameStatus==6){
			if(charStr == 'p' || charStr == 'P')
				pause();
			else if(charcode == 13 && gameStatus==6){
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

window.onclick = clickIzquierdoMenu;