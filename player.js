var fs = require("fs")
var _ = require('lodash')

function getPlayer(playerName, pitcher_flag) {
	//the league's average calculated each year.
	//The ".011" added reflects the frequency that Groundball A++ will also become hits.
	//2016 stats
	var isPitcher = false

	const NLBA = 0.254 + 0.011
	const ALBA = 0.257 + 0.011
	const MLBBA = 0.255 + 0.011 // just use this for now
	const testBA = 0.265 + 0.011 // for Cal Ripkin testing only

	var fielding_data = fs.readFileSync("2016-standard-fielding.json")
	var fielding_stats = JSON.parse(fielding_data)

	var current_player_name = {'Name': playerName}
	var player_fielding_stats = _.find(fielding_stats, current_player_name)

	if (player_fielding_stats['Pos Summary'] == "P" && pitcher_flag !== "-b") {
		isPitcher = true
		//this set has data about how batters fared against the pitcher. doubles given up, etc
		var pitching_data = fs.readFileSync("2016-batting-pitching.json")
		var pitching_stats = JSON.parse(pitching_data)
		var player_pitching_stats = _.find(pitching_stats, current_player_name)
		var player_pitching = player_pitching_stats

		//this set has data about ERA, errors, etc
		var pitching_record_data = fs.readFileSync("2016-standard-pitching.json")
		var pitching_record_stats = JSON.parse(pitching_record_data)
		var player_pitching_record_stats = _.find(pitching_record_stats, current_player_name)
		var player_pitching_record = player_pitching_record_stats

		//might want batting stats too
		var batting_data = fs.readFileSync("2016-standard-batting.json")
		var batting_stats = JSON.parse(batting_data)
		var player_batting_stats = _.find(batting_stats, current_player_name)
	} else {
		var batting_data = fs.readFileSync("2016-standard-batting.json")
		var batting_stats = JSON.parse(batting_data)
		var player_batting_stats = _.find(batting_stats, current_player_name)
	}

	var player_batting = player_batting_stats
	var player_fielding = player_fielding_stats

/*	console.log(
		somPW(player_pitching_record), 
		somPH(player_pitching_record), 
		somPK(player_pitching_record), 
		somPD(player_pitching), 
		somPT(player_pitching), 
		somPHR(player_pitching), 
		somPE(player_pitching),
		somPWP(player_pitching_record),
		somBalk(player_pitching_record)
	)*/

	var player

	if (isPitcher == true) {
		var pitcher =
		{
			'name': playerName,
			'positions': somPos(player_fielding),
			'W': player_pitching_record.W,
			'L': player_pitching_record.L,
			'ERA': player_pitching_record.ERA,
			'IP': _.round(player_pitching_record.IP),
			'SO': player_pitching_record.SO,
			'som_walk': somPW(player_pitching_record) * 20,
			'som_single': somPH(player_pitching_record) * 20,
			'som_double': somPD(player_pitching) * 20,
			'som_triple': somPT(player_pitching) * 20,
			'som_hr': somPHR(player_pitching) * 20,
			'som_strikeout': somPK(player_pitching_record) * 20,
			'som_gb-ss': 140,
			'som_gb-2b': 120,
			'som_gb-cf': 60,
			'som_gb-3b': 60,
			'som_fly-lf': 40,
			'som_fly-rf': 40,
			'som_errors': somPE(player_pitching),
			'som_balks': somBalk(player_pitching_record) * 20,
			'som_wild': somPWP(player_pitching_record) * 20,
			'role': pitcherRole(player_pitching_record)
		}
		player = pitcher
	} else {
		var batter = 
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
		player = batter
	}	
	
	//som's own "plate appearance" number, testing only, not for use
	function somPA(player_batting) {
		var AB = _.toFinite(player_batting.AB)
		var W = _.toFinite(player_batting.BB)
		var IW = _.toFinite(player_batting.IBB)
		var HBP = _.toFinite(player_batting.HBP)

		return ( AB + ( W - IW ) + HBP )
	}

	//batter's walk. returns chances
	function somW(player_batting) {	
		var W = _.toFinite(player_batting.BB)
		var IW = _.toFinite(player_batting.IBB)
		var AB = _.toFinite(player_batting.AB)
		var HBP = _.toFinite(player_batting.HBP)

		//can't divide by zero
		if (W == 0) {
			return 0
		}

		var walk = (((W - IW) * 216) / (AB + ( W - IW) + HBP)) - 9

		//can't have negative chances on a card.
		if (walk < 0) {
			walk = 0
		}

		return _.round(walk)
	}

	//batter's hit by pitch. returns chances
	function somHBP(player_batting) {
		var W = _.toFinite(player_batting.BB)
		var IW = _.toFinite(player_batting.IBB)
		var AB = _.toFinite(player_batting.AB)
		var HBP = _.toFinite(player_batting.HBP)

		//can't divide by zero
		if (HBP == 0) {
			return 0
		}

		var hit_by_pitch = ((HBP * 216) / (AB + (W - IW) + HBP))

		//can't have negative chances on a card.
		if (hit_by_pitch < 0) {
			hit_by_pitch = 0
		}

		return _.round(hit_by_pitch)
	}

	//batter's hit. returns chances
	function somH(player_batting) {
		var W = somW(player_batting)
		var HBP = somHBP(player_batting)
		var BA = _.toFinite(player_batting.BA)
		var LG = player_batting.Lg
		var leagueBA = MLBBA

		//can't divide by zero
		if (BA == 0) {
			return 0
		}

		//find the right batting average
		if (LG == "NL") {
			leagueBA = NLBA
		} else if (LG == "AL") {
			leagueBA = ALBA
		}

		var hit = (( BA - leagueBA ) + BA ) * ( 108 - ( W + HBP ))

		//can't have negative chances on a card.
		if (hit < 0) {
			hit = 0
		}

		return _.round(hit)
	}

	//batter's double. returns subchances
	function somD(player_batting) {
		var second_bases = _.toFinite(player_batting['2B'])
		var AB = _.toFinite(player_batting.AB)
		var W = _.toFinite(player_batting.BB)
		var IW = _.toFinite(player_batting.IBB)
		var HBP = _.toFinite(player_batting.HBP)

		//can't divide by zero
		if (second_bases == 0) {
			return 0
		}

		var doubles = ( 4320 * second_bases ) / ( AB + ( W - IW ) + HBP ) - 90

		//can't have negative chances on a card. 
		if (doubles < 0) {
			doubles = 0
		}

		return _.round(doubles)
	}

	//batter's triple. returns subchances
	function somT(player_batting) {
		var third_bases = _.toFinite(player_batting['3B'])
		var AB = _.toFinite(player_batting.AB)
		var W = _.toFinite(player_batting.BB)
		var IW = _.toFinite(player_batting.IBB)
		var HBP = _.toFinite(player_batting.HBP)

		//can't divide by zero
		if (third_bases == 0) {
			return 0
		}

		var triples = ( 4320 * third_bases ) / ( AB + ( W - IW ) + HBP ) - 15

		//can't have negative chances on a card. 
		if (triples < 0) {
			triples = 0
		}

		return _.round(triples)
	}

	//batter's home run. returns subchances
	function somHR(player_batting) {
		var HR = _.toFinite(player_batting.HR)
		var AB = _.toFinite(player_batting.AB)
		var W = _.toFinite(player_batting.BB)
		var IW = _.toFinite(player_batting.IBB)
		var HBP = _.toFinite(player_batting.HBP)

		//can't divide by zero
		if (HR == 0) {
			return 0
		}

		var home_runs = ( 4320 * HR ) / ( AB + ( W - IW ) + HBP ) - 50

		//can't have negative chances on a card. 
		if (home_runs < 0) {
			home_runs = 0
		}

		return _.round(home_runs)
	}

	//batter's strike out. returns chances
	function somK(player_batting) {
		var K = _.toFinite(player_batting.SO)
		var AB = _.toFinite(player_batting.AB)
		var W = _.toFinite(player_batting.BB)
		var IW = _.toFinite(player_batting.IBB)
		var HBP = _.toFinite(player_batting.HBP)

		//can't divide by zero
		if (K == 0) {
			return 0
		}

		var strike_out = (( K * 216 ) / ( AB + ( W - IW ) + HBP )) - 17

		//can't have negative chances on a card. 
		if (strike_out < 0) {
			strike_out = 0
		}

		return _.round(strike_out)
	}

	//batter's ground ball A. returns chances
	function somGBA(player_batting) {
		var DP = _.toFinite(player_batting.GDP)
		var AB = _.toFinite(player_batting.AB)
		var W = _.toFinite(player_batting.BB)
		var IW = _.toFinite(player_batting.IBB)
		var HBP = _.toFinite(player_batting.HBP)

		//can't divide by zero
		if (DP == 0) {
			return 0
		}

		var ground_ball_A = ( 1140 * DP ) / ( AB + ( W - IW ) + HBP )

		return _.round(ground_ball_A)
	}

	//batter's ground ball B. returns chances.
	function somGBB(player_batting) {
		var GBA = somGBA(player_batting)

		var ground_ball_B = 31 - GBA

		if (ground_ball_B < 0) {
			ground_ball_B = 0
		}

		return _.round(ground_ball_B)
	}

	//runner's first stolen base. returns upper limit of 1d20
	function som1SB(player_batting) {	

		//(( SB / ( SB + CS )) + 0.13 ) * 20
		
	}

	//runner's steal rating based on simplified chart
	function somSteal(player_batting) {
		var SB = _.toFinite(player_batting.SB)

		if (_.inRange(SB, 0, 3)) {
			return "E"
		}

		if (_.inRange(SB, 3, 6)) {
			return "D"
		}

		if (_.inRange(SB, 6, 10)) {
			return "C"
		}

		if (_.inRange(SB, 10, 24)) {
			return "B"
		}

		if (_.inRange(SB, 24, 35)) {
			return "A"
		}

		if (_.inRange(SB, 35, 90)) {
			return "AA"
		}

		if (_.inRange(SB, 90, Infinity)) {
			return "AAA"
		}
	}

	function somRun(player_batting) {
		var SB = _.toFinite(player_batting.SB)

		if (_.inRange(SB, 0, 3)) {
			return "1-9"
		}

		if (_.inRange(SB, 3, 6)) {
			return "1-10"
		}

		if (_.inRange(SB, 6, 10)) {
			return "1-13"
		}

		if (_.inRange(SB, 10, 24)) {
			return "1-15"
		}

		if (_.inRange(SB, 24, 35)) {
			return "1-17"
		}

		if (_.inRange(SB, 35, 90)) {
			return "1-18"
		}

		if (_.inRange(SB, 90, Infinity)) {
			return "1-19"
		}
	}

	//runner's second stolen base. returns upper value of a d20 roll
	function som2SB(player_batting) {
		var SB1 = som1SB(player_batting)

		var second_stolen_base = (SB1 - ( SB1 / 3 )) + 1

		second_stolen_base = _.round(second_stolen_base)

		return second_stolen_base
	}

	//runner's stolen base lead
	function somSBLead(player_batting) {
		var SB = _.toFinite(player_batting.SB)
		var CS = _.toFinite(player_batting.CS)
		var H = _.toFinite(player_batting.H)
		var W = _.toFinite(player_batting.BB)
		var IW = _.toFinite(player_batting.IBB)
		var HBP = _.toFinite(player_batting.HBP)
		var second_bases = _.toFinite(player_batting['2B'])
		var third_bases = _.toFinite(player_batting['3B'])
		var HR = _.toFinite(player_batting.HR)

		var lead_chances = (36 * ( SB + CS )) / ((( H + ( W - IW ) + HBP ) * .85 ) - ( second_bases + third_bases + HR ))

		return lead_chances
	}

	//runner's asterisk. returns boolean
	function somAst(player_batting) {
		var SB1 = som1SB(player_batting)
		var SBLead = somSBLead(player_batting)

		if ((SB1 + SBLead) > 24) {
			//console.log(SB1 + SBLead)
			return true
		} else {
			//console.log(SB1 + SBLead)
			return false
		}
	}

	function somFlyB(player_batting) {
		return 11
	}

	function somFlyA(player_batting) {
		var HR = somHR(player_batting)

		if (HR >= 120) {
			return 1
		} else {
			return 0
		}
	}

	function somE(player_fielding) {
		var innings = _.toFinite(player_fielding.Inn)
		var errors = _.toFinite(player_fielding['E'])

		var err = (errors * 1458) / innings

		return _.round(err)
	}

	function somRange(player_fielding) {
		var rdrs = _.toFinite(player_fielding.Rdrs)

		if (_.inRange(rdrs, 12, Infinity)) {
			return 1
		}

		if (_.inRange(rdrs, 2, 12)) {
			return 2
		}

		if (_.inRange(rdrs, -1, 2)) {
			return 3
		}

		if (_.inRange(rdrs, -10, -1)) {
			return 4
		}

		if (_.inRange(rdrs, -Infinity, -10)) {
			return 5
		}
	}

	//player's positions. Returns an array of positions ranked by frequency
	function somPos(player_fielding) {
		var pos = player_fielding['Pos Summary']

		var positions = _.split(pos, "-")

		return positions
	}

	//pitcher's walks given up. player_pitching_record. returns chances
	function somPW(player_pitching) {
		//(( W - IW ) * 216 ) / ( TBF - IW )) - 9
		var W = _.toFinite(player_pitching.BB)
		var IW = _.toFinite(player_pitching.IBB)
		var TBF = _.toFinite(player_pitching.BF)

		var walks = ((( W - IW ) * 216 ) / ( TBF - IW )) - 9

		//can't have negative chances on a card.
		if (walks < 0) {
			walks = 0
		}

		return walks
	}

	//pitcher's hits given up. use player_pitching_record. returns chances
	function somPH(player_pitching) {
		//((( HIT / TBF ) * 216 ) - 29.4 ) + XF
		var HIT = _.toFinite(player_pitching.H)
		var TBF = _.toFinite(player_pitching.BF)

		var hits = ((( HIT / TBF ) * 216 ) - 29.4 ) + 4.9

		//can't have negative chances on a card.
		if (hits < 0) {
			hits = 0
		}

		return hits
	}

	//pitcher's doubles given up. use player_pitching. returns chances
	function somPD(player_pitching) {
		//	(( D * 216 ) / (TBF - IW )) - 90
		var TBF = _.toFinite(player_pitching.PA)
		var IW = _.toFinite(player_pitching.IBB)
		var D = _.toFinite(player_pitching['2B'])

		var doubles = (( D * 216 ) / (TBF - IW )) - 90

		//can't have negative chances on a card.
		if (doubles < 0) {
			doubles = 0
		}

		return doubles		
	}

	//pitcher's triples given up. use player_pitching. returns chances
	function somPT(player_pitching) {
		// (( T * 216 ) / (TBF - IW )) - 15
		var TBF = _.toFinite(player_pitching.PA)
		var IW = _.toFinite(player_pitching.IBB)
		var T = _.toFinite(player_pitching['3B'])

		var triples = (( T * 216 ) / (TBF - IW )) - 15

		//can't have negative chances on a card.
		if (triples < 0) {
			triples = 0
		}

		return triples
	}

	//pitcher's homeruns given up. use player_pitching. returns chances
	function somPHR(player_pitching) {
		// (( HR * 216 ) / (TBF - IW)) - 50
		var TBF = _.toFinite(player_pitching.PA)
		var IW = _.toFinite(player_pitching.IBB)
		var HR = _.toFinite(player_pitching.HR)

		var homeruns = (( HR * 216 ) / (TBF - IW)) - 50

		//can't have negative chances on a card.
		if (homeruns < 0) {
			homeruns = 0
		}

		return homeruns
	}

	//pitcher's strikeouts given up. use player_pitching_record. returns chances
	function somPK(player_pitching) {
		// (( K * 216 ) / ( TBF - IW ))
		var TBF = _.toFinite(player_pitching.BF)
		var IW = _.toFinite(player_pitching.IBB)
		var K = _.toFinite(player_pitching.SO)

		var strikeouts = (( K * 216 ) / ( TBF - IW )) - 16

		//can't have negative chances on a card.
		if (strikeouts < 0) {
			strikeouts = 0
		}

		return strikeouts
	}

	//pitcher's errors. use player_pitching. returns subchances
	function somPE(player_pitching) {
		var E = _.toFinite(player_pitching.ROE)
		var IP = _.toFinite(player_pitching.IP)
		//( E * 1458 ) / IP

		var errors = ( E * 1458 ) / IP

		//can't have negative chances on a card.
		if (errors < 0) {
			errors = 0
		}

		//every pitcher gets 120 subchances in basic game
		errors = 120

		return errors	
	}

	//pitcher's wild pitch. use player_pitching_record. Returns chances
	function somPWP(player_pitching) {
		//( WP * 200 ) / IP
		var IP = _.toFinite(player_pitching.IP)
		var WP = _.toFinite(player_pitching.WP)

		var wildpitch = ( WP * 200 ) / IP

		//can't have negative chances on card
		if (wildpitch < 0) {
			wildpitch = 0
		}

		return wildpitch
	}

	//balk. use player_pitching_record. returns chances
	function somBalk(player_pitching) {
		//( BALK * 290 ) / IP
		var BK = _.toFinite(player_pitching.BK)
		var IP = _.toFinite(player_pitching.IP)

		var balk = ( BK * 290 ) / IP

		//can't have negative chances on card
		if (balk < 0) {
			balk = 0
		}

		return balk
	}

	//pitcher's role. use player_pitching_record. returns starter or relief
	function pitcherRole(player_pitching) {
		var saves = player_pitching
		
		if (saves > 0) {
			return "relief"
		} else {
			return "starter"
		}
	}

	return player
}

module.exports = getPlayer