var fs = require("fs");
var _ = require('lodash');

function getPlayer(playerName) {
	//the league's average calculated each year.
	//The ".011" added reflects the frequency that Groundball A++ will also become hits.
	//2016 stats
	const NLBA = 0.254 + 0.011;
	const ALBA = 0.257 + 0.011;
	const MLBBA = 0.255 + 0.011; // just use this for now
	const testBA = 0.265 + 0.011; // for Cal Ripkin testing only

	var batting_data = fs.readFileSync("2016-standard-batting.json");
	var fielding_data = fs.readFileSync("2016-standard-fielding.json");
	var batting_stats = JSON.parse(batting_data);
	var fielding_stats = JSON.parse(fielding_data);

	var current_player_name = {'Name': playerName};
	//var current_player_name = {'Name': "Freddie Freeman"};
	//var current_player_name = {'Name': "Stephen Vogt"};

	var player_batting_stats = _.find(batting_stats, current_player_name);
	var player_fielding_stats = _.find(fielding_stats, current_player_name);

	//console.log(player_battingObj['2B']);
	//console.log(somAst(player_battingObj));

	var player_batting = player_batting_stats;
	var player_fielding = player_fielding_stats;

	//format a stat block in the console
	/*console.log("\n" + player_batting.Name, somPos(player_fielding), "\n===========================\n",
		"walk chances: " + somW(player_batting) + "\n\n", 
		"hit by pitch chances: " + somHBP(player_batting) + "\n\n", 
		"hit chances: " + somH(player_batting) + "\n\n", 
		"double chances: " + (somD(player_batting)/20) + " | subchances: " + somD(player_batting) + "\n\n", 
		"triple chances: " + (somT(player_batting)/20) + " | subchances: " + somT(player_batting) + "\n\n",
		"home run chances: " + (somHR(player_batting)/20) + " | subchances: " + somHR(player_batting) + "\n\n",
		"strikeout chances: " + somK(player_batting) + "\n\n",
		"ground ball A chances: " + somGBA(player_batting) + "\n\n",
		"ground ball B chances: " + somGBB(player_batting) + "\n\n",
		"steal rating: " + somSteal(player_batting) + "\n\n",
		//"second stolen base: " + som2SB(player_batting) + "\n\n",
		//"base stealing lead chances: " + somSBLead(player_batting) + "\n\n",
		"flyout A: " + somFlyA(player_batting) + "\n\n",
		"flyout B: " + somFlyB(player_batting) + "\n\n",
		"errors: " + somE(player_fielding) + "\n\n",
		"range: " + somRange(player_fielding) + "\n\n"
		);*/

	/*	console.log("\n" + player_batting.Name, somPos(player_fielding), "\n===========================\n",
		"walk: " + somW(player_batting) * 20 + "\n\n", 
		"hit by pitch: " + somHBP(player_batting) * 20 + "\n\n", 
		"hit: " + somH(player_batting) * 20 + "\n\n", 
		"double: " + somD(player_batting) + "\n\n", 
		"triple: " + somT(player_batting) + "\n\n",
		"home run: " + somHR(player_batting) + "\n\n",
		"strikeout: " + somK(player_batting) * 20 + "\n\n",
		"ground ball A: " + somGBA(player_batting) * 20 + "\n\n",
		"ground ball B: " + somGBB(player_batting) * 20 + "\n\n",
		"steal rating: " + somSteal(player_batting) + "\n\n",	
		"flyout A: " + somFlyA(player_batting) * 20 + "\n\n",
		"flyout B: " + somFlyB(player_batting) * 20 + "\n\n"	
		);*/

	var player = 
		{
			'name': playerName,
			'positions': somPos(player_fielding),
			'avg': player_batting.BA,
			'ab': _.toFinite(player_batting.AB),
			'doubles': _.toFinite(player_batting['2B']),
			'triples': _.toFinite(player_batting['3B']),
			'homeruns': _.toFinite(player_batting.HR),
			'rbi': _.toFinite(player_batting.RBI),
			'som_hr': somHR(player_batting),
			'som_triple': somT(player_batting),
			'som_double': somD(player_batting),
			'som_single': somH(player_batting) * 20,
			'som_walk': somW(player_batting) * 20,
			'som_hbp': somHBP(player_batting) * 20,
			'som_strikeout': somK(player_batting) * 20,
			'som_flyb': somFlyB(player_batting) * 20,
			'som_flya':somFlyA(player_batting) * 20,
			'som_gba': somGBA(player_batting) * 20,
			'som_gbb': somGBB(player_batting) * 20,
			'som_steal': somSteal(player_batting),
			'som_run': somRun(player_batting)

		}
	
	//som's own "plate appearance" number, testing only, not for use
	function somPA(player_batting) {
		var AB = _.toFinite(player_batting.AB);
		var W = _.toFinite(player_batting.BB);
		var IW = _.toFinite(player_batting.IBB);
		var HBP = _.toFinite(player_batting.HBP);

		return ( AB + ( W - IW ) + HBP );
	}

	//batter's walk. returns chances
	function somW(player_batting) {	
		var W = _.toFinite(player_batting.BB);
		var IW = _.toFinite(player_batting.IBB);
		var AB = _.toFinite(player_batting.AB);
		var HBP = _.toFinite(player_batting.HBP);

		//can't divide by zero
		if (W == 0) {
			return 0;
		}

		var walk = (((W - IW) * 216) / (AB + ( W - IW) + HBP)) - 9;

		//can't have negative chances on a card.
		if (walk < 0) {
			walk = 0;
		}

		return _.round(walk);
	}

	//batter's hit by pitch. returns chances
	function somHBP(player_batting) {
		var W = _.toFinite(player_batting.BB);
		var IW = _.toFinite(player_batting.IBB);
		var AB = _.toFinite(player_batting.AB);
		var HBP = _.toFinite(player_batting.HBP);

		//can't divide by zero
		if (HBP == 0) {
			return 0;
		}

		var hit_by_pitch = ((HBP * 216) / (AB + (W - IW) + HBP));

		//can't have negative chances on a card.
		if (hit_by_pitch < 0) {
			hit_by_pitch = 0;
		}

		return _.round(hit_by_pitch);
	}

	//batter's hit. returns chances
	function somH(player_batting) {
		var W = somW(player_batting);
		var HBP = somHBP(player_batting);
		var BA = _.toFinite(player_batting.BA);
		var LG = player_batting.Lg;
		var leagueBA = MLBBA;

		//can't divide by zero
		if (BA == 0) {
			return 0;
		}

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

		return _.round(hit);
	}

	//batter's double. returns subchances
	function somD(player_batting) {
		var second_bases = _.toFinite(player_batting['2B']);
		var AB = _.toFinite(player_batting.AB);
		var W = _.toFinite(player_batting.BB);
		var IW = _.toFinite(player_batting.IBB);
		var HBP = _.toFinite(player_batting.HBP);

		//can't divide by zero
		if (second_bases == 0) {
			return 0;
		}

		var doubles = ( 4320 * second_bases ) / ( AB + ( W - IW ) + HBP ) - 90;

		//can't have negative chances on a card. 
		if (doubles < 0) {
			doubles = 0;
		}

		return _.round(doubles);
	}

	//batter's triple. returns subchances
	function somT(player_batting) {
		var third_bases = _.toFinite(player_batting['3B']);
		var AB = _.toFinite(player_batting.AB);
		var W = _.toFinite(player_batting.BB);
		var IW = _.toFinite(player_batting.IBB);
		var HBP = _.toFinite(player_batting.HBP);

		//can't divide by zero
		if (third_bases == 0) {
			return 0;
		}

		var triples = ( 4320 * third_bases ) / ( AB + ( W - IW ) + HBP ) - 15;

		//can't have negative chances on a card. 
		if (triples < 0) {
			triples = 0;
		}

		return _.round(triples);
	}

	//batter's home run. returns subchances
	function somHR(player_batting) {
		var HR = _.toFinite(player_batting.HR);
		var AB = _.toFinite(player_batting.AB);
		var W = _.toFinite(player_batting.BB);
		var IW = _.toFinite(player_batting.IBB);
		var HBP = _.toFinite(player_batting.HBP);

		//can't divide by zero
		if (HR == 0) {
			return 0;
		}

		var home_runs = ( 4320 * HR ) / ( AB + ( W - IW ) + HBP ) - 50;

		//can't have negative chances on a card. 
		if (home_runs < 0) {
			home_runs = 0;
		}

		return _.round(home_runs);
	}

	//batter's strike out. returns chances
	function somK(player_batting) {
		var K = _.toFinite(player_batting.SO);
		var AB = _.toFinite(player_batting.AB);
		var W = _.toFinite(player_batting.BB);
		var IW = _.toFinite(player_batting.IBB);
		var HBP = _.toFinite(player_batting.HBP);

		//can't divide by zero
		if (K == 0) {
			return 0;
		}

		var strike_out = (( K * 216 ) / ( AB + ( W - IW ) + HBP )) - 17;

		//can't have negative chances on a card. 
		if (strike_out < 0) {
			strike_out = 0;
		}

		return _.round(strike_out);
	}

	//batter's ground ball A. returns chances
	function somGBA(player_batting) {
		var DP = _.toFinite(player_batting.GDP);
		var AB = _.toFinite(player_batting.AB);
		var W = _.toFinite(player_batting.BB);
		var IW = _.toFinite(player_batting.IBB);
		var HBP = _.toFinite(player_batting.HBP);

		//can't divide by zero
		if (DP == 0) {
			return 0;
		}

		var ground_ball_A = ( 1140 * DP ) / ( AB + ( W - IW ) + HBP );

		return _.round(ground_ball_A);
	}

	//batter's ground ball B. returns chances.
	function somGBB(player_batting) {
		var GBA = somGBA(player_batting);

		var ground_ball_B = 31 - GBA;

		if (ground_ball_B < 0) {
			ground_ball_B = 0;
		}

		return _.round(ground_ball_B);
	}

	//runner's first stolen base. returns upper limit of 1d20
	function som1SB(player_batting) {	

		//(( SB / ( SB + CS )) + 0.13 ) * 20;
		
	}

	//runner's steal rating based on simplified chart
	function somSteal(player_batting) {
		var SB = _.toFinite(player_batting.SB);

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
	}

	function somRun(player_batting) {
		var SB = _.toFinite(player_batting.SB);

		if (_.inRange(SB, 0, 3)) {
			return "1-9";
		}

		if (_.inRange(SB, 3, 6)) {
			return "1-10";
		}

		if (_.inRange(SB, 6, 10)) {
			return "1-13";
		}

		if (_.inRange(SB, 10, 24)) {
			return "1-15";
		}

		if (_.inRange(SB, 24, 35)) {
			return "1-17";
		}

		if (_.inRange(SB, 35, 90)) {
			return "1-18";
		}

		if (_.inRange(SB, 90, Infinity)) {
			return "1-19";
		}
	}

	//runner's second stolen base. returns upper value of a d20 roll
	function som2SB(player_batting) {
		var SB1 = som1SB(player_batting);

		var second_stolen_base = (SB1 - ( SB1 / 3 )) + 1;

		second_stolen_base = _.round(second_stolen_base);

		return second_stolen_base;
	}

	//runner's stolen base lead
	function somSBLead(player_batting) {
		var SB = _.toFinite(player_batting.SB);
		var CS = _.toFinite(player_batting.CS);
		var H = _.toFinite(player_batting.H);
		var W = _.toFinite(player_batting.BB);
		var IW = _.toFinite(player_batting.IBB);
		var HBP = _.toFinite(player_batting.HBP);
		var second_bases = _.toFinite(player_batting['2B']);
		var third_bases = _.toFinite(player_batting['3B']);
		var HR = _.toFinite(player_batting.HR);

		var lead_chances = (36 * ( SB + CS )) / ((( H + ( W - IW ) + HBP ) * .85 ) - ( second_bases + third_bases + HR ));

		return lead_chances;
	}

	//runner's asterisk. returns boolean
	function somAst(player_batting) {
		var SB1 = som1SB(player_batting);
		var SBLead = somSBLead(player_batting);

		if ((SB1 + SBLead) > 24) {
			//console.log(SB1 + SBLead);
			return true;
		} else {
			//console.log(SB1 + SBLead);
			return false;
		}
	}

	function somFlyB(player_batting) {
		return 11;
	}

	function somFlyA(player_batting) {
		var HR = somHR(player_batting);

		if (HR >= 120) {
			return 1;
		} else {
			return 0;
		}
	}

	function somE(player_fielding) {
		var innings = _.toFinite(player_fielding.Inn);
		var errors = _.toFinite(player_fielding['E']);

		var err = (errors * 1458) / innings;

		return _.round(err);
	}

	function somRange(player_fielding) {
		var rdrs = _.toFinite(player_fielding.Rdrs);

		if (_.inRange(rdrs, 12, Infinity)) {
			return 1;
		}

		if (_.inRange(rdrs, 2, 12)) {
			return 2;
		}

		if (_.inRange(rdrs, -1, 2)) {
			return 3;
		}

		if (_.inRange(rdrs, -10, -1)) {
			return 4;
		}

		if (_.inRange(rdrs, -Infinity, -10)) {
			return 5;
		}
	}

	//player's positions. Returns an array of positions ranked by frequency
	function somPos(player_fielding) {
		var pos = player_fielding['Pos Summary'];

		var positions = _.split(pos, "-");

		return positions;

	}

	return player
}

module.exports = getPlayer