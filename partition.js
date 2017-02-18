var _ = require('lodash');

var card = 
[
    {name: '1-2', subchances: 0, total: 20, result: ['line out into as many outs as possible'], index: 0},
    {name: '1-3', subchances: 40, total: 40, result: [], index: 1},
    {name: '1-4', subchances: 60, total: 60, result: [], index: 2},
    {name: '1-5', subchances: 80, total: 80, result: [], index: 3},
    {name: '1-6', subchances: 100, total: 100, result: [], index: 4},
    {name: '1-7', subchances: 120, total: 120, result: [], index: 5},
    {name: '1-8', subchances: 100, total: 100, result: [], index: 6},
    {name: '1-9', subchances: 80, total: 80, result: [], index: 7},
    {name: '1-10', subchances: 60, total: 60, result: [], index: 8},
    {name: '1-11', subchances: 40, total: 40, result: [], index: 9},
    {name: '1-12', subchances: 20, total: 20, result: [], index: 10},
    {name: '2-2', subchances: 20, total: 20, result: [], index: 11},
    {name: '2-3', subchances: 40, total: 40, result: [], index: 12},
    {name: '2-4', subchances: 60, total: 60, result: [], index: 13},
    {name: '2-5', subchances: 80, total: 80, result: [], index: 14},
    {name: '2-6', subchances: 100, total: 100, result: [], index: 15},
    {name: '2-7', subchances: 120, total: 120, result: [], index: 16},
    {name: '2-8', subchances: 100, total: 100, result: [], index: 17},
    {name: '2-9', subchances: 80, total: 80, result: [], index: 18},
    {name: '2-10', subchances: 60, total: 60, result: [], index: 19},
    {name: '2-11', subchances: 40, total: 40, result: [], index: 20},
    {name: '2-12', subchances: 20, total: 20, result: [], index: 21},
    {name: '3-2', subchances: 20, total: 20, result: [], index: 22},
    {name: '3-3', subchances: 40, total: 40, result: [], index: 23},
    {name: '3-4', subchances: 60, total: 60, result: [], index: 24},
    {name: '3-5', subchances: 80, total: 80, result: [], index: 25},
    {name: '3-6', subchances: 100, total: 100, result: [], index: 26},
    {name: '3-7', subchances: 120, total: 120, result: [], index: 27},
    {name: '3-8', subchances: 100, total: 100, result: [], index: 28},
    {name: '3-9', subchances: 80, total: 80, result: [], index: 29},
    {name: '3-10', subchances: 60, total: 60, result: [], index: 30},
    {name: '3-11', subchances: 40, total: 40, result: [], index: 31},
    {name: '3-12', subchances: 20, total: 20, result: [], index: 32}   
]

let homers = 125
let triples = 1
let doubles = 120
let singles = 420
let walks = 280
let hbp = 260
let strikeouts = 300
let gba = 340
let gbb = 280
let flya = 0
let flyb = 0

//returns the object that is the best choice for what to subtract subchances
//handle all subtractions and result setting outside this function in a while loop
function findBestEntry(current_stat) {
    let subchances_list = _.map(card, 'subchances')
    let smallerNums = []

    //loops through all of the subchances and makes a list of subchances less than target
    _.forEach(subchances_list, function(value) {
        if (value <= current_stat && value !== 0) {
            smallerNums.push(value)
        }
    })

    //if the smallerNums array is empty, then the current stat is smaller than all the subchances
    //find the index of the value in the subchances list that is the smallest non-zero value (min of a compact array)
    if (smallerNums.length == 0) {
        var sortIndex = _.findIndex(subchances_list, function(o) { return o === _.min(_.compact(subchances_list))})
    } else {
        //looks up the index of the value in the subchances list that is the biggest number that is also smaller than the current stat
        var sortIndex = _.findIndex(subchances_list, function(o) { return o === _.max(smallerNums) })
    }

    //finds the object in the card array with the same index as the matching value in the subchances list
    let matchingEntry = _.find(card, _.matchesProperty('index', sortIndex))

    return matchingEntry
}


function assignStat(total, text, split = false) {
    while (total > 0) {
        var entry = findBestEntry(total)
        var total_subchances = entry.total
        console.log("totals", total_subchances)

        if (entry.subchances <= total) {
            //it's less than total so just take the whole thing
            total -= entry.subchances
            entry.result.push(text)
            entry.subchances = 0
        } else {
            //it's more than the total so we have to split
            //get the number of subchances per die increment
            let roll_value = (total_subchances / 10) / 2

            //subtract the amount from the entry          
            entry.subchances -= total

            //find upper value of the range (not the d20 roll)
            var spread = _.round( ( total_subchances - entry.subchances) / roll_value )

            //if it's the first split, it's a range of 1 to something        
            if (entry.result[0] == undefined) {
                if (spread == 1) {
                    entry.result.push({'spread': spread, 'lower': 1, 'upper': 1, 'text': text + " 1"})
                    console.log(entry.result)
                } else {
                    var upper_range = spread
                    entry.result.push({'spread': spread, 'lower': 1, 'upper': upper_range, 'text': text + " 1-" + upper_range})
                    console.log(entry.result)
                }
            } else {
                var last_entry = _.last(entry.result)                
                var lower_range = last_entry.upper + 1              

                if (spread == 1) {
                    var upper_range = lower_range
                    entry.result.push({'spread': spread, 'lower': lower_range, 'upper': upper_range, 'text': text + " " + lower_range})
                    console.log(entry.result)
                } else {
                    var upper_range = lower_range + spread
                    if (upper_range > 20) {upper_range = 20}
                    entry.result.push({'spread': spread, 'lower': lower_range, 'upper': upper_range, 'text': text + " " + lower_range + "-" + upper_range})
                    console.log(entry.result)
                }
                
            }          
            
            total = 0      
        }
    }

    return total 
}

homers = assignStat(homers, "homerun")
triples = assignStat(triples, "triple")
doubles = assignStat(doubles, "double")

singles = assignStat(singles, "single")
walks = assignStat(walks, "walk")
hbp = assignStat(hbp, "hit by pitch")
strikeouts = assignStat(strikeouts, "strikeout")
gba = assignStat(gba, "ground ball A")
gbb = assignStat(gbb, "ground ball B")
flya = assignStat(flya, "flyball A")
flyb = assignStat(flyb, "flyball B")


console.log(card)


