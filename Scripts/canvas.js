
// Variables del Canvas 
var canvas;
var ctx;
var drawing = new Image();

// Estado del Juego
var gameStatus = 0;
var paused = false;

// 0 = Menu inicial
// 1 = Menu Dificultad
// 2 = Juego Principal
// 3 = End Game Screen
// 4 = Juego de 2J
// 5 = Configuraciones
// 6 = Pause Screen
// 7 = Scores Screen
// 8 = CutScenes
// 9 = NewRecord Screen
// 10 = Game Over Screen
// 11 = Start Menu

// Variables actuales del juego
var dif = 0; 						// Determina la dificultad seleccionada
var images=[];

var cantidadInicial; 				// Determina la cantidad inicial de pelotitas
var pRadio; 						// Determina el radio de los PowerUps
var mRadio; 						// Determina el radio de los meteoros
var uRadio; 						// Determina el radio del jugador

var pSpeed; 						// Determina la velocidad de los PowerUps
var mSpeed; 						// Determina la velocidad de los meteoros
var uSpeed;  						// Determina la velocidad del jugador

var prob; 							// Determina la probabilidad de powerups
var multi; 							// Determina el bonus por dificultad

var pelotas= []; 					// Es el arreglo de todos los objetos en la pantalla (No jugador)
var firstClick = false;
var songRand = 0; 					// Cancion de playlist actual

var difText= [
	"Noob",
	"Ez",
	"Respect",
	"Pro"
];

var velPoints=0; 					// Variable que determina puntaje extra
const isStorage = 'undefined' 
	!== typeof localStorage;

var mouse = { 						// Posicion actual de Mouse
	x : 0,
	y : 0
};

var mouseP = {	 					// Posicion del Mouse al hacer pausa
	x : 0,
	y : 0
};

/*****************************  FUNCION DE MOVIMIENTO DE MOUSE  **********************************/
function mouseMove(e){
	mouse.x = e.x;
	mouse.y = e.y;

	// Pinta cuadrito 
	if(gameStatus == 2){
		drawPlayer();
		velPoints++;
		if(velPoints>(50/multi)){
			velPoints=0;
			score++;
		}
	}
}

/********************************  FUNCION DE CLICK DERECHO  **********************************/
function clickDerechoMenu(e){
	// Desactiva opciones de click derecho
	document.addEventListener("contextmenu", function(e){
	e.preventDefault();
	}, false);
	console.log(mouse.x, mouse.y);
}

/********************************  FUNCION QUE HACE LA PAUSA  **********************************/
function pause(){
	paused = !paused;
	if(paused){
		gameStatus = 6;
		var sounds = document.getElementsByTagName('audio');
  		for(i=0; i<sounds.length; i++) sounds[i].pause();

		canvas.requestPointerLock = canvas.requestPointerLock ||
                            	canvas.mozRequestPointerLock ||
                            	canvas.webkitRequestPointerLock;
                          
   		canvas.requestPointerLock();

		ctx.font = "30px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "#2497c1";
		ctx.fillText("PAUSA ", canvas.width/2, 200);
		ctx.fillText("Presione Enter para salir o P para reanudar", canvas.width/2, 250);
		document.getElementById('none').style.cursor = "none";
 
	}
	else{
		if(musicOp){
			var songPlay = document.getElementById("SFXGamePlay"+dif+"_"+songRand);
  			songPlay.play();
		}

		document.exitPointerLock = document.exitPointerLock ||
			   document.mozExitPointerLock ||
			   document.webkitExitPointerLock;
		document.exitPointerLock();

		document.getElementById('none').style.cursor = "none";
		gameStatus = 2;
	}
}

/*****************************  FUNCION QUE LIMPIA LAS PELOTITAS  **********************************/
function initUpdates(){
	// Limpiar
	requestAnimationFrame(initUpdates);

	if(gameStatus == 2){
		// Limpia pantalla y pinta el jugador 
		if(!paused){
			//ctx.clearRect(0,0, canvas.width, canvas.height);
			ctx.drawImage(images[defaultBG], 0, 0, canvas.width+100, canvas.height+100);
			// Fondo opaco
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

			// Actualizar objetos
			for(let j=0; j<pelotas.length; j++){
				var p = pelotas[j];

				// Si el mouse toca algún objeto
				if((mouse.x-uRadio <= (p.x+p.radious-(p.radious/10)) && mouse.x+uRadio >= p.x-p.radious+(p.radious/10)) && 
					(mouse.y-uRadio <= (p.y+p.radious-(p.radious/10)) && mouse.y+uRadio >= p.y-p.radious+(p.radious/10))){
					if(p.id == 0){
						if(soundOp){
							var songPlay = document.getElementById("SFXGood");
							songPlay.play();
						}
						score+=(5*prob);
					}
					else if(p.id == 1){
						if(soundOp){
							var songPlay = document.getElementById("SFXGood");
							songPlay.play();
						}
						lives++;
					}
					else if(p.id == 2){
						if(soundOp){
							var songPlay = document.getElementById("SFXGood");
							songPlay.play();
						}
						hits=0;
					}
					else if(p.id == 3){
						damage = true;
						if(soundOp){
							var songPlay = document.getElementById("SFXBad");
							songPlay.play();
						}
						hits++;
						lives--;
					}
					pelotas.splice(j, 1); 			// Se elmina del arreglo
					createCircle(); 				// Se crea uno nuevo
				}
				
				// Si el objeto desaparece de la pantalla
				if(p.x -(p.radious)>=canvas.width || p.x+(p.radious)<=0 || 
					p.y-(p.radious)>=canvas.height || p.y+(p.radious)<=0){
					pelotas.splice(j, 1); 			// Se elmina del arreglo
					createCircle();
				}
				p.update(); 	// Actualiza los frames
			}

			// Actualiza Label
			ctx.font = "30px Arial";
			ctx.textAlign = "center";
			ctx.fillStyle = "#2497c1";
			ctx.fillText("Hits: "+hits, 60, 30);
			ctx.fillText("Lives: "+lives, 60, 60);

			// Si el objeto desaparece de la pantalla
			if(mouse.x-uRadio>=canvas.width || mouse.y+uRadio<=0 || 
				mouse.y-uRadio>=canvas.height || mouse.y+uRadio<=0)
					endGame();

			// Si ya no le quedan vidas al jugador...
			if(lives<=0)
				endGame();
		}
	}
}

/********************************  FUNCION DE FINALIZAR JUEGO  **********************************/
function endGame(){
	gameStatus = 3;
	pelotas= [];
	entities= [];
	document.getElementById('none').style.cursor = "default";
	score *= multi;
	score = score.toFixed(2);
	score = parseFloat(score);
	temp = score;

	if(score > ScoresDB[4].score){
		newRecord();
	}

	else
		gameOver();
}

/********************************  FUNCION DE GAME OVER  **********************************/
function gameOver(){
	gameStatus = 10;

	var img = new Image();
	img.src = backgrounds[defaultBG];
	img.onload = function(){
	// Texto Inicial
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
	ctx.fillText("Hits: "+hits, canvas.width/2, 165);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("Hits: "+hits, canvas.width/2-3, 168);

	ctx.fillStyle = "#A46FE5";
	ctx.fillText("Presiona S para ir al Menú", canvas.width/2, 255);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("Presiona S para ir al Menú", canvas.width/2-3, 258);

	ctx.fillStyle = "#3F47CE";
	ctx.fillText("Presiona R para reintentar", canvas.width/2, 300);
	ctx.fillStyle = "#E1CDB5";
	ctx.fillText("Presiona R para reintentar", canvas.width/2-3, 303);
	}
}

/********************************  FUNCION DE NEW RECORD  **********************************/
function newRecord(){
	gameStatus = 9;

	var data="";
	username = "";
	/*ctx.clearRect(0,0, canvas.width, canvas.height);
	console.log("New Record!!!");

	ctx.font = "35px Arial";
	ctx.fillText("New Record!!!", canvas.width/2, 100);
	ctx.font = "30px Arial";*/

	$('#myModal').modal('show', function (event){});
}

function uploadRecord(data){
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();

	today = dd + '/' + mm + '/' + (yyyy+1023);

	var s = new ScoreText(score, difText[dif], data, today);
	ScoresDB.push(s);

	var JSON_obj = JSON.stringify(ScoresDB);

	isStorage && localStorage.setItem("high-scores", JSON_obj);
	getConfigs();
	gameOver();
}

/********************************  FUNCION DE INICIAR JUEGO **********************************/
function startGame(difPar){
	dif = difPar;

	var sounds = document.getElementsByTagName('audio');
 	for(i=0; i<sounds.length; i++) sounds[i].pause();
	if(musicOp){
		var songPlay = document.getElementsByName("songs"+dif);
		var rand = songPlay[Math.floor(Math.random() * songPlay.length)];
		rand.load();
  		rand.play();
	}

	initStars();

	// Se determinan los valores dependiendo de la dificultad
	lives=  dificultad[dif].lives;
	pRadio= dificultad[dif].pRadio;	
	mRadio= dificultad[dif].mRadio;
	uRadio= dificultad[dif].uRadio;
	pSpeed= dificultad[dif].pSpeed;
	mSpeed= dificultad[dif].mSpeed;
	prob= dificultad[dif].prob;
	multi= dificultad[dif].multi;

	// Cambia a modo 1J
	gameStatus = 2;
	score=0;
	hits=0;

	// Elimina el cursor
	document.getElementById('none').style.cursor = "none";

	// Se crean los meteoros
	for(let i=0; i<dificultad[dif].cantidadInicial; i++){
		createCircle();
	}

	// Esto actualiza los colores
	if(!firstClick)
		initUpdates();	

	firstClick = true;
}

/********************************** FUNCION PARA VER SCORES ****************************************/
function viewScores(){
	gameStatus = 7;

	// Para cambiar el cursor
	var t2 = setInterval(function(){ 
		var px = mouse.x;
		var py = mouse.y;
		if(gameStatus == 7){
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

	// Se limpia todo
	ctx.clearRect(0,0, canvas.width, canvas.height);

	// Se pone el fondo
	var img = new Image();
	img.src = backgrounds[defaultBG];
	//img.onload = function(){
	ctx.drawImage(img, 0, 0, canvas.width+100, canvas.height+100);

	// Cuadrados
	ctx.globalAlpha = 0.3;
	ctx.strokeStyle = "#FFF";
	ctx.fillStyle = "#061130";
	ctx.strokeRect(canvas.width/2-620, 100, canvas.width-100, canvas.height/2+80);
	ctx.fillRect(canvas.width/2-620, 100, canvas.width-100, canvas.height/2+80);
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
	ctx.fillText("Dificultad", canvas.width/2-250, 135);
	ctx.fillText("Username", canvas.width/2+50, 135);
	ctx.fillText("Date", canvas.width/2+400, 135);

	ctx.fillStyle = "#2497c1";
	for(let i=0; i<ScoresDB.length; i++){
		ctx.strokeStyle = "#FFF";
		ctx.fillText((i+1)+".- ", canvas.width/2-580, 175+(i*60));
		ctx.fillText(ScoresDB[i].score, canvas.width/2-450, 175+(i*60));
		ctx.fillText(ScoresDB[i].dificultad, canvas.width/2-250, 175+(i*60));
		ctx.fillText(ScoresDB[i].user, canvas.width/2+50, 175+(i*60));
		ctx.fillText(ScoresDB[i].date, canvas.width/2+400, 175+(i*60));
		//console.log(ScoresDB);
	}

	ctx.strokeStyle = "#FFF";
	ctx.strokeRect(40, 30, 50, 50);
	ctx.fillText("<", 65, 65);
	//}
}


/********************************  FUNCION PARA CONFIGURACIONES  **********************************/
function selectConfig(){
	gameStatus = 5;

	// Para cambiar el cursor
	var t2 = setInterval(function(){ 
		var px = mouse.x;
		var py = mouse.y;
		if(gameStatus == 5){
			if(((px >= 42 && px <= 98) && (py >= 33 && py <= 95)) ||
				((px >= canvas.width/2-(canvas.width/2-230) && px <= canvas.width/2-(canvas.width/2-330)) 
				&& (py >= 153 && py <= 205))  ||
				((px >= canvas.width/2-(canvas.width/2-230) && px <= canvas.width/2-(canvas.width/2-330)) 
				&& (py >= 253 && py <= 305)) ||
				((px >= canvas.width/2-(canvas.width/2-80) && px <= canvas.width/2-(canvas.width/2-120)) 
				&& (py >= 510 && py <= 550)) ||
				((px >= canvas.width/2-(canvas.width/2-150) && px <= canvas.width/2-(canvas.width/2-190)) 
				&& (py >= 510 && py <= 550)) ||
				((px >= canvas.width/2-(canvas.width/2-220) && px <= canvas.width/2-(canvas.width/2-270)) 
				&& (py >= 510 && py <= 550)) ||
				((px >= canvas.width/2-(canvas.width/2-290) && px <= canvas.width/2-(canvas.width/2-350)) 
				&& (py >= 510 && py <= 550)) ||
				((px >= canvas.width/2-(canvas.width/2-360) && px <= canvas.width/2-(canvas.width/2-430)) 
				&& (py >= 510 && py <= 550)) ||
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

	// TITULO
	ctx.font = "80px Magneto";
	ctx.textAlign = "center";
	
	ctx.fillStyle = "#3F47CE";
	ctx.fillText("C", canvas.width/2-310, 75);
	ctx.fillStyle = "#A46FE5";
	ctx.fillText("onfiguraciones", canvas.width/2+45, 75);

	ctx.fillStyle = "#E1CDB5";
	ctx.fillText("C", canvas.width/2-315, 80);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("onfiguraciones", canvas.width/2+40, 80);

	// MUSICA
	ctx.fillStyle = "#2497c1";
	ctx.strokeStyle = "#FFF";
	ctx.font = "35px Magneto";
	ctx.textAlign = "center";
	
	ctx.fillStyle = "#3F47CE";
	ctx.fillText("M", canvas.width/2-580, canvas.height/2-120);
	ctx.fillStyle = "#A46FE5";
	ctx.fillText("usica:", canvas.width/2-510, canvas.height/2-120);

	ctx.fillStyle = "#E1CDB5";
	ctx.fillText("M", canvas.width/2-585, canvas.height/2-118);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("usica:", canvas.width/2-515, canvas.height/2-118);

	// Cuadrados
	ctx.globalAlpha = 0.3;
	ctx.strokeStyle = "#FFF";
	ctx.fillStyle = "#061130";
	for(let i=0; i<2; i++){
		ctx.strokeRect(canvas.width/2-(canvas.width/2-220), (i*100+150), 100, 50);
		ctx.fillRect(canvas.width/2-(canvas.width/2-220), (i*100+150), 100, 50);
	}
	ctx.globalAlpha = 1.0;

	ctx.font = "30px Arial";
	ctx.textAlign = "center";
	ctx.fillStyle = "#2497c1";

	//ctx.strokeRect(canvas.width/2-(canvas.width/2-220), 150, 100, 50);
	ctx.textAlign = "center";
	if(musicOp)	
		ctx.fillText("On", canvas.width/2-(canvas.width/2-270), 185);
	else
		ctx.fillText("Off", canvas.width/2-(canvas.width/2-270), 185);

	// SONIDO
	ctx.fillStyle = "#2497c1";
	ctx.strokeStyle = "#FFF";
	ctx.font = "35px Magneto";
	ctx.textAlign = "center";
	
	ctx.fillStyle = "#3F47CE";
	ctx.fillText("S", canvas.width/2-580, canvas.height/2-26);
	ctx.fillStyle = "#A46FE5";
	ctx.fillText("onido:", canvas.width/2-510, canvas.height/2-26);

	ctx.fillStyle = "#E1CDB5";
	ctx.fillText("S", canvas.width/2-585, canvas.height/2-24);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("onido:", canvas.width/2-515, canvas.height/2-24);

	ctx.font = "30px Arial";
	ctx.textAlign = "center";
	ctx.fillStyle = "#2497c1";

	ctx.textAlign = "left";
	ctx.strokeStyle = "#FFF";
	//ctx.fillText("Sonido: ", canvas.width/2-(canvas.width/2-60), 285);
	//ctx.strokeRect(canvas.width/2-(canvas.width/2-220), 250, 100, 50);
	ctx.textAlign = "center";
	if(soundOp)	
		ctx.fillText("On", canvas.width/2-(canvas.width/2-270), 285);
	else
		ctx.fillText("Off", canvas.width/2-(canvas.width/2-270), 285);

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
	//ctx.fillText("Background: ", canvas.width/2-(canvas.width/2-60), 385);

	// PLAYER COLOR
	ctx.fillStyle = "#2497c1";
	ctx.strokeStyle = "#FFF";
	ctx.font = "35px Magneto";
	ctx.textAlign = "center";
	
	ctx.fillStyle = "#3F47CE";
	ctx.fillText("P", canvas.width/2-580, canvas.height/2+171);
	ctx.fillStyle = "#A46FE5";
	ctx.fillText("layer color:", canvas.width/2-450, canvas.height/2+171);

	ctx.fillStyle = "#E1CDB5";
	ctx.fillText("P", canvas.width/2-585, canvas.height/2+173);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("layer color:", canvas.width/2-455, canvas.height/2+173);

	ctx.strokeStyle = "#FFF";
	//ctx.fillText("Player color: ", canvas.width/2-(canvas.width/2-60), 485);

	ctx.beginPath();
	ctx.arc(canvas.width/2-(canvas.width/2-80), 520, 20, 0, Math.PI*2, false);
	ctx.fillStyle = "#3AAF29";
	ctx.fill();
	if(idColor == 0){
		ctx.strokeStyle = "Red";
		ctx.arc(canvas.width/2-(canvas.width/2-80), 520, 20, 0, Math.PI*2, false);
		ctx.stroke();
	}

	ctx.beginPath();
	ctx.arc(canvas.width/2-(canvas.width/2-160), 520, 20, 0, Math.PI*2, false);
	ctx.fillStyle = "#35CAAC";
	ctx.fill();
	if(idColor == 1){
		ctx.strokeStyle = "Red";
		ctx.arc(canvas.width/2-(canvas.width/2-160), 520, 20, 0, Math.PI*2, false);
		ctx.stroke();
	}

	ctx.beginPath();
	ctx.arc(canvas.width/2-(canvas.width/2-240), 520, 20, 0, Math.PI*2, false);
	ctx.fillStyle = "#2522F4";
	ctx.fill();
	if(idColor == 2){
		ctx.strokeStyle = "Red";
		ctx.arc(canvas.width/2-(canvas.width/2-240), 520, 20, 0, Math.PI*2, false);
		ctx.stroke();
	}

	ctx.beginPath();
	ctx.arc(canvas.width/2-(canvas.width/2-320), 520, 20, 0, Math.PI*2, false);
	ctx.fillStyle = "#5A11B2";
	ctx.fill();
	if(idColor == 3){
		ctx.strokeStyle = "Red";
		ctx.arc(canvas.width/2-(canvas.width/2-320), 520, 20, 0, Math.PI*2, false);
		ctx.stroke();
	}

	ctx.beginPath();
	ctx.arc(canvas.width/2-(canvas.width/2-400), 520, 20, 0, Math.PI*2, false);
	ctx.fillStyle = "#C63B98";
	ctx.fill();
	if(idColor == 4){
		ctx.strokeStyle = "Red";
		ctx.arc(canvas.width/2-(canvas.width/2-400), 520, 20, 0, Math.PI*2, false);
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

/********************************* FUNCION PARA SELECCIONAR OPCIONES 2J **********************************/

/******************************** FUNCION PARA SELECCIONAR DIFICULTAD 1J **********************************/
function mode1J(){
	gameStatus = 1;
	pelotas= [];

	// Limpiar pantalla
	ctx.fillStyle = "#000";
	ctx.clearRect(0,0, canvas.width, canvas.height);

	// Para cambiar el cursor
	var t2 = setInterval(function(){ 
		var px = mouse.x;
		var py = mouse.y;
		if(gameStatus == 1){
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
			if(gameStatus == 0)
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

	// Dificultades disponibles
	ctx.font = "25px Magneto";
	ctx.textAlign = "center";

	// Cuadrados
	ctx.globalAlpha = 0.3;
	ctx.strokeStyle = "#FFF";
	ctx.fillStyle = "#061130";
	for(let i=0; i<4; i++){
		ctx.strokeRect(canvas.width/2-120, 150+(i*100), 240, 50);
		ctx.fillRect(canvas.width/2-120, 150+(i*100), 240, 50);
	}
	ctx.globalAlpha = 1.0;

	// Modo de Juego 1J
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

/**********************************  FUNCION DE MENU  **********************************/
function Menu(){
	gameStatus = 0;
	document.getElementById('none').style.cursor = "default";

	// Para cambiar el cursor a CROSS
	var t2 = setInterval(function(){ 
		var px = mouse.x;
		var py = mouse.y;
		if(gameStatus == 0){
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


	// Limpiar Pantalla
	ctx.fillStyle = "#000";
	//ctx.clearRect(0,0, canvas.width, canvas.height);

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

	// Opciones
	ctx.font = "25px Magneto";
	ctx.textAlign = "center";

	// Cuadrados
	ctx.globalAlpha = 0.3;
	ctx.strokeStyle = "#FFF";
	ctx.fillStyle = "#061130";
	for(let i=0; i<4; i++){
		ctx.strokeRect(canvas.width/2-120, 150+(i*100), 240, 50);
		ctx.fillRect(canvas.width/2-120, 150+(i*100), 240, 50);
	}
	ctx.globalAlpha = 1.0;

	// Modo de Juego 1J
	ctx.strokeStyle = "#FFF";
	ctx.strokeRect(canvas.width/2-120, 150, 240, 50);	

	ctx.fillStyle = "#A46FE5";
	ctx.fillText("1 Jugador", canvas.width/2, 185);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("1 Jugador", canvas.width/2-2, 185+2);

	ctx.fillStyle = "#145268";
	// Modo de Juego 2J
	ctx.strokeStyle = "#FFF";
	ctx.strokeRect(canvas.width/2-120, 250, 240, 50);	
	ctx.fillText("2 Jugadores", canvas.width/2, 285);

	// Configuraciones
	ctx.strokeRect(canvas.width/2-120, 350, 240, 50);	
	ctx.fillStyle = "#A46FE5";
	ctx.fillText("Configuraciones", canvas.width/2, 385);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("Configuraciones", canvas.width/2-2, 385+2);

	// Scores
	ctx.strokeRect(canvas.width/2-120, 450, 240, 50);
	ctx.fillStyle = "#A46FE5";
	ctx.fillText("Scores", canvas.width/2, 485);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("Scores", canvas.width/2-2, 485+2);

	// Creditos
	ctx.font = "15px Sans";
	ctx.strokeStyle = "#FFF";	
	ctx.fillText("Creditos: Roberto Sevilla", 85, 610);
	//}
}

/**********************************  FUNCION DE MENU  **********************************/
function StartMenu(){
	gameStatus = 11;
	document.getElementById('none').style.cursor = "default";

	// Para cambiar el cursor a CROSS
	var t2 = setInterval(function(){ 
		var px = mouse.x;
		var py = mouse.y;
		if(gameStatus == 11){
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


	// Limpiar Pantalla
	ctx.fillStyle = "#000";
	//ctx.clearRect(0,0, canvas.width, canvas.height);

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

	// Opciones
	ctx.font = "25px Magneto";
	ctx.textAlign = "center";

	// Cuadrados
	ctx.globalAlpha = 0.3;
	ctx.strokeStyle = "#FFF";
	ctx.fillStyle = "#061130";
	ctx.strokeRect(canvas.width/2-120, 250, 240, 50);
	ctx.fillRect(canvas.width/2-120, 250, 240, 50);
	ctx.globalAlpha = 1.0;

	// Modo de Juego 1J
	ctx.strokeStyle = "#FFF";
	ctx.strokeRect(canvas.width/2-120, 250, 240, 50);	

	ctx.fillStyle = "#A46FE5";
	ctx.fillText("Start Game", canvas.width/2, 285);
	ctx.fillStyle = "#A4D6A3";
	ctx.fillText("Start Game", canvas.width/2-2, 285+2);

	// Creditos
	ctx.font = "15px Sans";
	ctx.strokeStyle = "#FFF";	
	ctx.fillText("Creditos: Roberto Sevilla", 85, 610);
	}
}

/*********************************** FUNCION INICIAL ***********************************/
function init(){
	// Se crea Canvas
	canvas = document.getElementById('mycanvas');
	canvas.height = window.innerHeight-40;
	canvas.width = window.innerWidth-45;
	ctx = canvas.getContext("2d");

	// Funcion al presionar botón de Score
    $(document).ready(function(){
		$('#buttonAccept').click(function(){
			var name = document.getElementById('InputUsername');
			uploadRecord(name.value);
		})
	})

	var JSON_obj = JSON.stringify(1);
	isStorage && localStorage.setItem("first-time", JSON_obj);
	
	// Actualiza los scores y acepta los inputs
	getConfigs();
	inputs();
	preloadimages();

	// Verifica si es primera vez o no
	/*if(!localStorage.getItem('first-time'))
		viewStory();
	else{
		var JSON_obj = JSON.stringify(1);
		isStorage && localStorage.setItem("first-time", JSON_obj);

		// Se ejecuta el menu principal
		Menu();
	}*/

	// Ejecuta menu
	StartMenu();
	//Menu();
}



/*********************************** CARGA DE ATRIBUTOS ***********************************/
window.onmousemove = mouseMove;
window.onauxclick = clickDerechoMenu;
window.onload= init;