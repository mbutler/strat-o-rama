var fs = require("fs");
var _ = require('lodash');

const leagueBA = 0.255 + 0.11;

var content = fs.readFileSync("2016-standard-batting.json");
var batting_stats = JSON.parse(content);

var playerObj = _.find(batting_stats, { 'Name': "Cal Ripkin"});

//console.log(playerObj['2B']);
//console.log(somAst(playerObj));

var player = playerObj;

var testNumb = somW(player) + somHBP(player) + somH(player) + (somD(player)/20) + (somT(player)/20) + (somHR(player)/20) + somK(player) + somGBA(player) + somGBB(player);
console.log("\n" + player.Name, "\n===========================\n",
	"walk chances: " + somW(player) + "\n\n", 
	"hit by pitch chances: " + somHBP(player) + "\n\n", 
	"hit chances: " + somH(player) + "\n\n", 
	"double chances: " + (somD(player)/20) + " | subchances: " + somD(player) + "\n\n", 
	"triple chances: " + (somT(player)/20) + " | subchances: " + somT(player) + "\n\n",
	"home run chances: " + (somHR(player)/20) + " | subchances: " + somHR(player) + "\n\n",
	"strikeout chances: " + somK(player) + "\n\n",
	"ground ball A chances: " + somGBA(player) + "\n\n",
	"ground ball B chances: " + somGBB(player) + "\n\n"
	);
console.log(testNumb);

//som's own plate appearance number, testing only
function somPA(player) {
	var AB = _.toFinite(player.AB);
	var W = _.toFinite(player.BB);
	var IW = _.toFinite(player.IBB);
	var HBP = _.toFinite(player.HBP);

	return ( AB + ( W - IW ) + HBP );
}

//batter's walk. returns chances
function somW(player) {	
	var W = _.toFinite(player.BB);
	var IW = _.toFinite(player.IBB);
	var AB = _.toFinite(player.AB);
	var HBP = _.toFinite(player.HBP);

	var walk = (((W - IW) * 216) / (AB + ( W - IW) + HBP)) - 9;

	return walk;
}

//batter's hit by pitch. returns chances
function somHBP(player) {
	var W = _.toFinite(player.BB);
	var IW = _.toFinite(player.IBB);
	var AB = _.toFinite(player.AB);
	var HBP = _.toFinite(player.HBP);

	var hit_by_pitch = ((HBP * 216) / (AB + (W - IW) + HBP));

	return hit_by_pitch;
}

//batter's hit. returns chances
function somH(player) {

	var W = somW(player);
	var HBP = somHBP(player);
	var BA = _.toFinite(player.BA);

	var hit = (( BA - leagueBA ) + BA ) * ( 108 - ( W + HBP ));

	return hit;
}

//batter's double. returns subchances
function somD(player) {
	var second_bases = _.toFinite(player['2B']);
	var AB = _.toFinite(player.AB);
	var W = _.toFinite(player.BB);
	var IW = _.toFinite(player.IBB);
	var HBP = _.toFinite(player.HBP);

	var doubles = ( 4320 * second_bases ) / ( AB + ( W - IW ) + HBP ) - 90;

	if (doubles < 0) {
		doubles = 0;
	}

	return doubles;
}

//batter's triple. returns subchances
function somT(player) {
	var third_bases = _.toFinite(player['3B']);
	var AB = _.toFinite(player.AB);
	var W = _.toFinite(player.BB);
	var IW = _.toFinite(player.IBB);
	var HBP = _.toFinite(player.HBP);

	var triples = ( 4320 * third_bases ) / ( AB + ( W - IW ) + HBP ) - 15;

	if (triples < 0) {
		triples = 0;
	}

	return triples;
}

//batter's home run
function somHR(player) {
	var HR = _.toFinite(player.HR);
	var AB = _.toFinite(player.AB);
	var W = _.toFinite(player.BB);
	var IW = _.toFinite(player.IBB);
	var HBP = _.toFinite(player.HBP);

	var home_runs = ( 4320 * HR ) / ( AB + ( W - IW ) + HBP ) - 50;

	if (home_runs < 0) {
		home_runs = 0;
	}

	return home_runs;
}

//batter's strike out. returns chances
function somK(player) {
	var K = _.toFinite(player.SO);
	var AB = _.toFinite(player.AB);
	var W = _.toFinite(player.BB);
	var IW = _.toFinite(player.IBB);
	var HBP = _.toFinite(player.HBP);

	var strike_out = (( K * 216 ) / ( AB + ( W - IW ) + HBP )) - 17;

	//can't have negative chances on a card. 
	if (strike_out < 0) {
		strike_out = 0;
	}

	return strike_out;
}

//batter's ground ball A. returns chances
function somGBA(player) {
	var DP = _.toFinite(player.GDP);
	var AB = _.toFinite(player.AB);
	var W = _.toFinite(player.BB);
	var IW = _.toFinite(player.IBB);
	var HBP = _.toFinite(player.HBP);


	var ground_ball_A = ( 1140 * DP ) / ( AB + ( W - IW ) + HBP );

	return ground_ball_A;
}

//batter's ground ball B. returns chances.
function somGBB(player) {
	var GBA = somGBA(player);

	var ground_ball_B = 31 - GBA;

	if (ground_ball_B < 0) {
		ground_ball_B = 0;
	}

	return ground_ball_B;
}

//runner's first stolen base. returns upper value of a d20 roll
function som1SB(player) {
	var SB = _.toFinite(player.SB);
	var CS = _.toFinite(player.CS);

	if (SB == 0 && CS == 0) {
		var first_stolen_base = 0.13 * 20;
	} else {
		var first_stolen_base = (( SB / ( SB + CS )) + 0.13 ) * 20;
	}

	if (first_stolen_base > 20) {
		first_stolen_base = 19;
	}

	first_stolen_base = _.round(first_stolen_base);

	//returns the ceiling of a 1d20 roll. e.g. 15 is a 1-15 success
	return first_stolen_base;
}

//runner's second stolen base. returns upper value of a d20 roll
function som2SB(player) {
	var SB1 = som1SB(player);

	var second_stolen_base = (SB1 - ( SB1 / 3 )) + 1;

	second_stolen_base = _.round(second_stolen_base);

	return second_stolen_base;
}

//runner's stolen base lead
function somSBLead(player) {
	var SB = _.toFinite(player.SB);
	var CS = _.toFinite(player.CS);
	var H = _.toFinite(player.H);
	var W = _.toFinite(player.BB);
	var IW = _.toFinite(player.IBB);
	var HBP = _.toFinite(player.HBP);
	var second_bases = _.toFinite(player['2B']);
	var third_bases = _.toFinite(player['3B']);
	var HR = _.toFinite(player.HR);

	var lead_chances = (36 * ( SB + CS )) / ((( H + ( W - IW ) + HBP ) * .85 ) - ( second_bases + third_bases + HR ));

	return lead_chances;
}

//runner's asterisk. returns boolean
function somAst(player) {
	var SB1 = som1SB(player);
	var SBLead = somSBLead(player);

	if ((SB1 + SBLead) > 24) {
		//console.log(SB1 + SBLead);
		return true;
	} else {
		//console.log(SB1 + SBLead);
		return false;
	}
}

