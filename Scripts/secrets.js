function clearScores(){
	var s = new ScoreText(0, "No Score", "");
	ScoresDB.push(s);

	var JSON_obj = JSON.stringify(ScoresDB);

	isStorage && localStorage.setItem("high-scores", JSON_obj);
}