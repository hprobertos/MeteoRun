// Difficulties
var difficulty= [
	{difficulty_id: 0,
	initialQuantity: 10,
	lives: 5,
	pRadio: 20,
	mRadio: 10,
	user_size: 3,
	pSpeed: 2,
	mSpeed: 3,
	uSpeed: 5,
	prob: .05,
	multi: .1},

	{difficulty_id: 1,
	initialQuantity: 20,
	lives: 3,
	pRadio: 15,
	mRadio: 15,
	user_size: 5,
	pSpeed: 4,
	mSpeed: 5,
	uSpeed: 10,
	prob: .04,
	multi: .3},

	{difficulty_id: 2,
	initialQuantity: 25,
	lives: 2,
	pRadio: 10,
	mRadio: 20,
	user_size: 8,
	pSpeed: 5,
	mSpeed: 6,
	uSpeed: 15,
	prob: .03,
	multi: .5},

	{difficulty_id: 3,
	initialQuantity: 30,
	lives: 1,
	pRadio: 8,
	mRadio: 23,
	user_size: 10,
	pSpeed: 10,
	mSpeed: 8,
	uSpeed: 20,
	prob: .02,
	multi: 1.8}];

// Scores
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
	if (isStorage && localStorage.getItem('high-scores')){
		var JSON_obj = localStorage.getItem('high-scores').split(',');
		ScoresDB = JSON.parse(JSON_obj);
		ScoresDB = ScoresDB.sort(function(a, b){ return a.score - b.score; });
		ScoresDB = ScoresDB.reverse();
		if(ScoresDB.length > 5){
			ScoresDB = ScoresDB.slice(0,5);
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

function ScoreText(score, difficulty, user, date){
	this.score = score;
	this.difficulty = difficulty;
	this.user = user;
	this.date = date;
}

function setDefaultScores(){
	ScoresDB = [];
	var s = new ScoreText(2, "Noob", "Toto", "27/06/2080");
	ScoresDB.push(s);
	s = new ScoreText(200, "Noob", "Annoying Ad", "13/03/3011");
	ScoresDB.push(s);
	s = new ScoreText(500, "Ez", "Cookie Alien", "09/12/2099");
	ScoresDB.push(s);
	s = new ScoreText(1500, "Respect", "PHP Soldiers", "30/07/3020");
	ScoresDB.push(s);
	s = new ScoreText(2000, "Pro", "Full Stock Devs", "24/07/3040");
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