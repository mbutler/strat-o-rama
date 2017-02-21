var fs = require('fs')
var mkdirp = require('mkdirp');
var _ = require('lodash')
var player = require('./player')
var card = require('./card')
var team = require('./team')
var PDFDocument = require('pdfkit')

var teams = {
    ARI: "Arizona Diamondbacks",
    ATL: "Atlanta Braves",
    BAL: "Baltimore Orioles",
    BOS: "Boston Red Sox",
    CHC: "Chicago Cubs",
    CHW: "Chicago White Sox",
    CIN: "Cincinnati Reds",
    CLE: "Cleveland Indians",
    COL: "Colorado Rockies",
    DET: "Detroit Tigers",
    HOU: "Houston Astros",
    KCR: "Kansas City Royals",
    LAA: "Los Angeles Angels of Anaheim",
    LAD: "Los Angeles Dodgers",
    MIA: "Miami Marlins",
    MIL: "Milwaukee Brewers",
    MIN: "Minnesota Twins",
    NYM: "New York Mets",
    NYY: "New York Yankees",
    OAK: "Oakland Athletics",
    PHI: "Philadelphia Phillies",
    PIT: "Pittsburgh Pirates",
    SDP: "San Diego Padres",
    SEA: "Seattle Mariners",
    SFG: "San Francisco Giants",
    STL: "St. Louis Cardinals",
    TBR: "Tampa Bay Rays",
    TEX: "Texas Rangers",
    TOR: "Toronto Blue Jays",
    WSN: "Washington Nationals"
}

const arg_name = process.argv[2]
const pitcher_batting_flag = process.argv[3]
var player_list = []

var team_abr = _.keys(teams)

//if a three letter name is passed in, it's a team
if (_.includes(team_abr, arg_name)) {
    var current_team = team(arg_name)

    //create directory of team name
    var dir = _.snakeCase(teams[arg_name])
    mkdirp.sync(dir);

    //loop through the team list and create a card for each player
    _.forEach(current_team, function(value) {
        var player_stats = player(value, pitcher_batting_flag)
        var player_card = card(player_stats, pitcher_batting_flag)
        createCard(player_card, player_stats, pitcher_batting_flag)
    })
} else if (arg_name.length > 3) {
    var player_stats = undefined

    player_stats = player(arg_name, pitcher_batting_flag)

    if (player_stats == undefined) {
        console.log("Couldn't find that player.")
        return
    }

    var player_card = card(player_stats, pitcher_batting_flag)

    var dir = 'players'
    mkdirp.sync(dir);

    createCard(player_card, player_stats, pitcher_batting_flag)
} else {
    console.log("Couldn't find that team or player.")
}

function createCard(data, player_stats, pitcher_batting_flag) {
    var isPitcher = false

    if (player_stats.positions[0] == "P" && pitcher_batting_flag !== "-b") {
        isPitcher = true
    }
    //loop through player card and make a list of all results
    var text_list = []
    _.forEach(data, function(value) {
        var play = ''
        _.forEach(value['result'], function(result) {
            play += result.text + ' '
        })
        text_list.push(play)
    });

    var doc = new PDFDocument({
        layout: 'portrait',
        size: [216, 360],
        margin: 9
    })

    //output a pdf with player name as file name
    doc.pipe(fs.createWriteStream('./' + dir + '/' + _.snakeCase(player_stats.name) + '.pdf'))

    //add clip art
    doc.image('baseball.jpg', 150, 9, { fit: [30, 225] })

    var box_num = []
    if (isPitcher == true) {
        box_num = ['4', '5', '6']
    } else {
        box_num = ['1', '2', '3']
    }

    //box 1
    doc.rect(9, 72, 66, 18)
        .fillOpacity(0.2)
        .fill('#cadcf9')
        .fontSize(12)
        .fill('black')
        .text(box_num[0], 38, 76)

    //box 2
    doc.rect(75, 72, 66, 18)
        .fillOpacity(0.2)
        .fill('#cadcf9')
        .fontSize(12)
        .fill('black')
        .text(box_num[1], 104, 76)
        //box 3
    doc.rect(141, 72, 66, 18)
        .fillOpacity(0.2)
        .fill('#cadcf9')
        .fontSize(12)
        .fill('black')
        .text(box_num[2], 170, 76)

    //lines
    doc.moveTo(9, 72)
        .lineTo(207, 72)
        .stroke()
        .moveTo(9, 90)
        .lineTo(207, 90)
        .stroke()
        .moveTo(9, 306)
        .lineTo(207, 306)
        .stroke()
        .moveTo(75, 72)
        .lineTo(75, 306)
        .stroke()
        .moveTo(141, 72)
        .lineTo(141, 306)
        .stroke()

    //logo
    doc.fontSize(18)
        .fill('black')
        .font('computerfont.ttf')
        .text('Stat-O-Magic', 9, 9)

    //player name
    doc.fontSize(10)
        .moveDown()
        .font('Helvetica-Bold')
        .text(_.upperCase(player_stats.name))

    //position
    doc.fontSize(8)
        .moveUp()
        .font('Helvetica')
        .text(player_stats.positions[0], { align: 'center' })


    if (isPitcher == true) {
        //role
        doc.fontSize(8)
            .moveUp()
            .font('Helvetica')
            .text(player_stats.role, { align: 'right' })

        //PITCHING RECORD
        //label
        doc.fontSize(8)
            .font('Helvetica-Bold')
            .text('PITCHING RECORD', 12, 311, { align: 'center' })

        //blue box
        doc.rect(9, 320, 198, 31)
            .fillOpacity(0.2)
            .fill('#cadcf9')

        //wins
        doc.fontSize(8)
            .fill('black')
            .font('Helvetica')
            .text('W', 15, 326)
            .moveDown(0.2)
            .text(player_stats.W)

        //losses
        doc.fontSize(8)
            .fill('black')
            .font('Helvetica')
            .text('L', 55, 326)
            .moveDown(0.2)
            .text(player_stats.L)

        //ERA
        doc.fontSize(8)
            .fill('black')
            .font('Helvetica')
            .text('ERA', 95, 326)
            .moveDown(0.2)
            .text(player_stats.ERA)

        //innings pitches
        doc.fontSize(8)
            .fill('black')
            .font('Helvetica')
            .text('IP', 145, 326)
            .moveDown(0.2)
            .text(player_stats.IP)

        //strike outs
        doc.fontSize(8)
            .fill('black')
            .font('Helvetica')
            .text('SO', 185, 326)
            .moveDown(0.2)
            .text(player_stats.SO)
    } else {
        //stealing
        doc.fontSize(8)
            .moveUp()
            .font('Helvetica')
            .text('stealing-' + player_stats.som_steal, { align: 'right' })
            .moveDown(0.2)
            .text('running ' + player_stats.som_run, { align: 'right' })

        //BATTING RECORD
        //label
        doc.fontSize(8)
            .font('Helvetica-Bold')
            .text('BATTING RECORD', 12, 311, { align: 'center' })

        //blue box
        doc.rect(9, 320, 198, 31)
            .fillOpacity(0.2)
            .fill('#cadcf9')

        //batting average
        doc.fontSize(8)
            .fill('black')
            .font('Helvetica')
            .text('AVG', 15, 326)
            .moveDown(0.2)
            .text(player_stats.avg)

        //at bats
        doc.fontSize(8)
            .fill('black')
            .font('Helvetica')
            .text('AB', 50, 326)
            .moveDown(0.2)
            .text(player_stats.ab)

        //2B
        doc.fontSize(8)
            .fill('black')
            .font('Helvetica')
            .text('2B', 85, 326)
            .moveDown(0.2)
            .text(player_stats.doubles)

        //3B
        doc.fontSize(8)
            .fill('black')
            .font('Helvetica')
            .text('3B', 120, 326)
            .moveDown(0.2)
            .text(player_stats.triples)

        //HR
        doc.fontSize(8)
            .fill('black')
            .font('Helvetica')
            .text('HR', 155, 326)
            .moveDown(0.2)
            .text(player_stats.homeruns)

        //RBI
        doc.fontSize(8)
            .fill('black')
            .font('Helvetica')
            .text('RBI', 185, 326)
            .moveDown(0.2)
            .text(player_stats.rbi)
    }







    /// RESULTS///

    //column 1
    //2
    doc.fontSize(8)
        .fill('black')
        .font('Helvetica-Bold')
        .text('2-', 12, 96, { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[0])

    //3
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('3-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[1])

    //4
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('4-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[2])

    //5
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('5-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[3])

    //6
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('6-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[4])

    //7
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('7-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[5])

    //8
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('8-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[6])

    //9
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('9-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[7])

    //10
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('10-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[8])

    //11
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('11-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[9])

    //12
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('12-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[10])

    //column 2
    //2
    doc.fontSize(8)
        .font('Helvetica-Bold')
        .text('2-', 78, 96, { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[11])

    //3
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('3-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[12])

    //4
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('4-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[13])

    //5
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('5-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[14])

    //6
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('6-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[15])

    //7
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('7-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[16])

    //8
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('8-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[17])

    //9
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('9-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[18])

    //10
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('10-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[19])

    //11
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('11-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[20])

    //12
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('12-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[21])

    //column 3
    //2
    doc.fontSize(8)
        .font('Helvetica-Bold')
        .text('2-', 144, 96, { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[22])

    //3
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('3-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[23])

    //4
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('4-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[24])

    //5
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('5-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[25])

    //6
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('6-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[26])

    //7
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('7-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[27])

    //8
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('8-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[28])

    //9
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('9-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[29])

    //10
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('10-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[30])

    //11
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('11-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[31])

    //12
    doc.fontSize(8)
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text('12-', { continued: true, width: 60 })
        .font('Helvetica')
        .text(text_list[32])


    console.log(player_stats.name + " card generated successfully.")
    doc.end()
}