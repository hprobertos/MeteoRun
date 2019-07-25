// Dificultades disponibles
var dificultad= [
	{dif: 0,
	cantidadInicial: 10,
	lives: 5,
	pRadio: 20,
	mRadio: 10,
	uRadio: 3,
	pSpeed: 2,
	mSpeed: 3,
	uSpeed: 5,
	prob: .05,
	multi: .1},

	{dif: 1,
	cantidadInicial: 20,
	lives: 3,
	pRadio: 15,
	mRadio: 15,
	uRadio: 5,
	pSpeed: 4,
	mSpeed: 5,
	uSpeed: 10,
	prob: .04,
	multi: .3},

	{dif: 2,
	cantidadInicial: 25,
	lives: 2,
	pRadio: 10,
	mRadio: 20,
	uRadio: 8,
	pSpeed: 5,
	mSpeed: 6,
	uSpeed: 15,
	prob: .03,
	multi: .5},

	{dif: 3,
	cantidadInicial: 30,
	lives: 1,
	pRadio: 8,
	mRadio: 23,
	uRadio: 10,
	pSpeed: 10,
	mSpeed: 8,
	uSpeed: 20,
	prob: .02,
	multi: 1.8}];

// Scores en BD
var ScoresDB = [];
var test = [];
var backgrounds = [
	'Src/bg0.jpg',
	'Src/bg1.jpg',
	'Src/bg2.jpg',
	'Src/bg3.jpg',
	'Src/bg4.jpg',];

var temp;
var defaultBG = 0;
var musicOp = true;
var soundOp = true;
var idColor = 0;
var username="Player";

function getConfigs(){
	if(localStorage.getItem('first-time')){
		if (isStorage && localStorage.getItem('high-scores')){
			var JSON_obj = localStorage.getItem('high-scores').split(',');
			ScoresDB = JSON.parse(JSON_obj);
			ScoresDB = ScoresDB.sort(function(a, b){ return a.score - b.score; });
			ScoresDB = ScoresDB.reverse();
			if(ScoresDB.length > 5){
				ScoresDB = ScoresDB.slice(0,5);
				//console.log(ScoresDB);
			}
		}

		if (isStorage && localStorage.getItem('music-op')){
			var JSON_obj = localStorage.getItem('music-op');
			musicOp = JSON.parse(JSON_obj);
		}

		if (isStorage && localStorage.getItem('sound-op')){
			var JSON_obj = localStorage.getItem('sound-op');
			soundOp = JSON.parse(JSON_obj);
		}

		if (isStorage && localStorage.getItem('color-op')){
			var JSON_obj = localStorage.getItem('color-op');
			idColor = JSON.parse(JSON_obj);	
		}

		if (isStorage && localStorage.getItem('bg-op')){
			var JSON_obj = localStorage.getItem('bg-op');
			defaultBG = JSON.parse(JSON_obj);
		}
	}
	else{
		setDefaultScores();
		defaultBG = 0;
		musicOp = true;
		soundOp = true;
		idColor = 0;
		username = "Player";
	}
}

function viewStory(){
	console.log("Hello, stranger");
	gameStatus = 8;
	document.getElementById('none').style.cursor = "default";

	// Título
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.font = "20px Arial";
	ctx.textAlign = "left";
	ctx.fillStyle = "#2497c1";
	ctx.fillText("Año 3042, Galaxia Uranio Atómico Básico de Cobalto (UABC)", 50, 50);

	// Modo de Juego 1J
	ctx.strokeStyle = "#FFF";
	ctx.fillText("Después de que el reinado de los bichos gigantes terminara cayendo gracias a la civilización humana", 50, 185);
	ctx.fillText("de la Galaxia UABC, las consecuencias de la guerra comenzaron a hacerse presente.", 50, 205);
	ctx.fillText("Incluso cuando el reinado de los bichos gigantes terminó, existen varias civilizaciones como los", 50, 235);
	ctx.fillText("alienígenas en forma de galleta y los soldados de la galaxia Pre Hombre Positivo (PHP),", 50, 255);
	ctx.fillText("que querían el dominio total de la Galaxia de UABC.", 50, 275); 

	// Modo de Juego 2J
	/*ctx.strokeStyle = "#FFF";
	ctx.strokeRect(400, 250, 200, 50);	
	ctx.fillText("2 Jugadores", 500, 285);

	// Configuraciones
	ctx.strokeStyle = "#FFF";
	ctx.strokeRect(380, 350, 240, 50);	
	ctx.fillText("Configuraciones", 500, 385);

	ctx.strokeStyle = "#FFF";
	ctx.strokeRect(400, 450, 200, 50);
	ctx.fillText("Scores", 500, 485);*/
}

function ScoreText(score, dificultad, user, date){
	this.score = score;
	this.dificultad = dificultad;
	this.user = user;
	this.date = date;
}

function setDefaultScores(){
	ScoresDB = [];
	var s = new ScoreText(2, "Noob", "Toto", "27/06/2080");
	ScoresDB.push(s);
	s = new ScoreText(3, "Noob", "Annoying Ad", "13/03/3011");
	ScoresDB.push(s);
	s = new ScoreText(4, "Ez", "Cookie Alien", "09/12/2099");
	ScoresDB.push(s);
	s = new ScoreText(6, "Respect", "PHP Soldiers", "30/07/3020");
	ScoresDB.push(s);
	s = new ScoreText(5, "Pro", "Full Stock Devs", "24/07/3040");
	ScoresDB.push(s);

	var JSON_obj = JSON.stringify(ScoresDB);

	isStorage && localStorage.setItem("high-scores", JSON_obj);
}

function changeMusic(){
	musicOp = !musicOp;
	var sounds = document.getElementsByTagName('audio');
	if(musicOp){
  		for(i=0; i<sounds.length; i++) sounds[i].muted = false;
	}
	else{
  		for(i=0; i<sounds.length; i++) sounds[i].muted = true;
	}

	var music = musicOp;
	var JSON_obj = JSON.stringify(musicOp);

	isStorage && localStorage.setItem("music-op", JSON_obj);

	selectConfig();
}

function changeAudio(){
	soundOp = !soundOp;

	var sound = soundOp;
	var JSON_obj = JSON.stringify(sound);

	isStorage && localStorage.setItem("sound-op", JSON_obj);

	selectConfig();
}

function changeUserColor(color){
	idColor = color;

	var colorOp = idColor;
	var JSON_obj = JSON.stringify(colorOp);

	isStorage && localStorage.setItem("color-op", JSON_obj);

	selectConfig();
}

function changeBackground(bg){
	defaultBG = bg;

	var bgOp = defaultBG;
	var JSON_obj = JSON.stringify(bgOp);

	isStorage && localStorage.setItem("bg-op", JSON_obj);

	selectConfig();
}