const fs = require('fs')
const _ = require('lodash')
const player = require('./player')
const csvToJson = require('convert-csv-to-json')
const paths = require('./config')

let fielding_data = csvToJson.fieldDelimiter(',').getJsonFromCsv(paths.standardFieldingPath)

let fielding_stats = []
_.forEach(fielding_data, player => {
    let split = _.split(player.Name, '\\')
    player.Name = split[0]
    fielding_stats.push(player)
})
fielding_stats = _.dropRight(fielding_stats)
function playerList(team) {
    var player_list = []

    _.forEach(fielding_stats, function(player) {
        if (player.Tm == team) {
            player_list.push(player.Name)
        }
    })

    return player_list
}

const teams = {
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

module.exports = {
    playerList: playerList,
    teamList: teams
}