var fs = require("fs");
var _ = require('lodash');

//the league's average calculated each year.
//The ".011" added reflects the frequency that Groundball A++ will also become hits.
//2016 stats
const NLBA = 0.254 + 0.011;
const ALBA = 0.257 + 0.011;
const MLBBA = 0.255 + 0.011; // just use this for now
const testBA = 0.265 + 0.011; // for Cal Ripkin testing only

var content = fs.readFileSync("2016-standard-batting.json");
var batting_stats = JSON.parse(content);

var player_stats = _.find(batting_stats, { 'Name': "Billy Hamilton"});

//console.log(playerObj['2B']);
//console.log(somAst(playerObj));

var player = player_stats;

//format a stat block in the console
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
	"ground ball B chances: " + somGBB(player) + "\n\n",
	"steal rating: " + som1SB(player) + "\n\n",
	//"second stolen base: " + som2SB(player) + "\n\n",
	//"base stealing lead chances: " + somSBLead(player) + "\n\n",
	"flyout A: " + somFlyA(player) + "\n\n",
	"flyout B: " + somFlyB(player) + "\n\n"
	);
console.log(testNumb);

//som's own "plate appearance" number, testing only, not for use
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

	//can't have negative chances on a card.
	if (walk < 0) {
		walk = 0;
	}

	return _.round(walk);
}

//batter's hit by pitch. returns chances
function somHBP(player) {
	var W = _.toFinite(player.BB);
	var IW = _.toFinite(player.IBB);
	var AB = _.toFinite(player.AB);
	var HBP = _.toFinite(player.HBP);

	var hit_by_pitch = ((HBP * 216) / (AB + (W - IW) + HBP));

	//can't have negative chances on a card.
	if (hit_by_pitch < 0) {
		hit_by_pitch = 0;
	}

	return _.round(hit_by_pitch);
}

//batter's hit. returns chances
function somH(player) {
	var W = somW(player);
	var HBP = somHBP(player);
	var BA = _.toFinite(player.BA);
	var LG = player.Lg;
	var leagueBA = MLBBA;

	//find the right batting average
	if (LG == "NL") {
		leagueBA = NLBA;
	} else if (LG == "AL") {
		leagueBA = ALBA;
	}

	var hit = (( BA - leagueBA ) + BA ) * ( 108 - ( W + HBP ));

	//can't have negative chances on a card.
	if (hit < 0) {
		hit = 0;
	}

	return _.round(hit, 2);
}

//batter's double. returns subchances
function somD(player) {
	var second_bases = _.toFinite(player['2B']);
	var AB = _.toFinite(player.AB);
	var W = _.toFinite(player.BB);
	var IW = _.toFinite(player.IBB);
	var HBP = _.toFinite(player.HBP);

	var doubles = ( 4320 * second_bases ) / ( AB + ( W - IW ) + HBP ) - 90;

	//can't have negative chances on a card. 
	if (doubles < 0) {
		doubles = 0;
	}

	return _.round(doubles);
}

//batter's triple. returns subchances
function somT(player) {
	var third_bases = _.toFinite(player['3B']);
	var AB = _.toFinite(player.AB);
	var W = _.toFinite(player.BB);
	var IW = _.toFinite(player.IBB);
	var HBP = _.toFinite(player.HBP);

	var triples = ( 4320 * third_bases ) / ( AB + ( W - IW ) + HBP ) - 15;

	//can't have negative chances on a card. 
	if (triples < 0) {
		triples = 0;
	}

	return _.round(triples);
}

//batter's home run. returns subchances
function somHR(player) {
	var HR = _.toFinite(player.HR);
	var AB = _.toFinite(player.AB);
	var W = _.toFinite(player.BB);
	var IW = _.toFinite(player.IBB);
	var HBP = _.toFinite(player.HBP);

	var home_runs = ( 4320 * HR ) / ( AB + ( W - IW ) + HBP ) - 50;

	//can't have negative chances on a card. 
	if (home_runs < 0) {
		home_runs = 0;
	}

	return _.round(home_runs);
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

	return _.round(strike_out);
}

//batter's ground ball A. returns chances
function somGBA(player) {
	var DP = _.toFinite(player.GDP);
	var AB = _.toFinite(player.AB);
	var W = _.toFinite(player.BB);
	var IW = _.toFinite(player.IBB);
	var HBP = _.toFinite(player.HBP);

	var ground_ball_A = ( 1140 * DP ) / ( AB + ( W - IW ) + HBP );

	return _.round(ground_ball_A);
}

//batter's ground ball B. returns chances.
function somGBB(player) {
	var GBA = somGBA(player);

	var ground_ball_B = 31 - GBA;

	if (ground_ball_B < 0) {
		ground_ball_B = 0;
	}

	return _.round(ground_ball_B);
}

//runner's first stolen base. returns steal rating.
function som1SB(player) {
	var SB = _.toFinite(player.SB);

	if (_.inRange(SB, 0, 3)) {
		return "E";
	}

	if (_.inRange(SB, 3, 6)) {
		return "D";
	}

	if (_.inRange(SB, 6, 10)) {
		return "C";
	}

	if (_.inRange(SB, 10, 24)) {
		return "B";
	}

	if (_.inRange(SB, 24, 35)) {
		return "A";
	}

	if (_.inRange(SB, 35, 90)) {
		return "AA";
	}

	if (_.inRange(SB, 90, Infinity)) {
		return "AAA";
	}

	//other formula
	//(( SB / ( SB + CS )) + 0.13 ) * 20;
	
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

function somFlyB(player) {
	return 11;
}

function somFlyA(player) {
	var HR = somHR(player);

	if (HR >= 120) {
		return 1;
	} else {
		return 0;
	}
}

