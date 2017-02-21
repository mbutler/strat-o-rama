var fs = require('fs')
var _ = require('lodash')
var player = require('./player')

var fielding_data = fs.readFileSync("2016-standard-fielding.json")
var fielding_stats = JSON.parse(fielding_data)

function getPlayerList(team) {
    var player_list = []

    _.forEach(fielding_stats, function(player) {
        if (player.Tm == team) {
            player_list.push(player.Name)
        }
    })

    return player_list
}

module.exports = getPlayerList