var _ = require('lodash');

//old
function getSubchancesList() {
    var subchances_list = [];

    //loop through all 3 columns
    for (let i = 1; i <= 3; i++) {
        var column = _.get(card, 'col' + i);

        //loop through each dice result in a column
        for (let j = 2; j <= 12; j++) {
            
            var die_result = _.get(column, j)

            subchances_list.push(die_result.subchances);                
        }    
    }

    return subchances_list
}

var card = 
[
    {name: '1-2', subchances: 20, result: [], index: 0},
    {name: '1-3', subchances: 1, result: [], index: 1},
    {name: '1-4', subchances: 0, result: [], index: 2},
    {name: '1-5', subchances: 0, result: [], index: 3},
    {name: '1-6', subchances: 0, result: [], index: 4},
    {name: '1-7', subchances: 0, result: [], index: 5},
    {name: '1-8', subchances: 10, result: [], index: 6},
    {name: '1-9', subchances: 0, result: [], index: 7},
    {name: '1-10', subchances: 0, result: [], index: 8},
    {name: '1-11', subchances: 40, result: [], index: 9},
    {name: '1-12', subchances: 20, result: [], index: 10},
    {name: '2-2', subchances: 20, result: [], index: 11},
    {name: '2-3', subchances: 40, result: [], index: 12},
    {name: '2-4', subchances: 60, result: [], index: 13},
    {name: '2-6', subchances: 80, result: [], index: 14},
    {name: '2-6', subchances: 11, result: [], index: 15},
    {name: '2-7', subchances: 120, result: [], index: 16},
    {name: '2-8', subchances: 0, result: [], index: 17},
    {name: '2-9', subchances: 80, result: [], index: 18},
    {name: '2-10', subchances: 60, result: [], index: 19},
    {name: '2-11', subchances: 40, result: [], index: 20},
    {name: '2-12', subchances: 20, result: [], index: 21},
    {name: '3-2', subchances: 20, result: [], index: 22},
    {name: '3-3', subchances: 40, result: [], index: 23},
    {name: '3-4', subchances: 60, result: [], index: 24},
    {name: '3-5', subchances: 80, result: [], index: 25},
    {name: '3-6', subchances: 0, result: [], index: 26},
    {name: '3-7', subchances: 120, result: [], index: 27},
    {name: '3-8', subchances: 10, result: [], index: 28},
    {name: '3-9', subchances: 80, result: [], index: 29},
    {name: '3-10', subchances: 60, result: [], index: 30},
    {name: '3-11', subchances: 40, result: [], index: 31},
    {name: '3-12', subchances: 20, result: [], index: 32}   
]





let homers = 10

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

console.log(findBestEntry(homers))
