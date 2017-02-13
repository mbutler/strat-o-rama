# strat-o-rama
predicting strat-o-matic cards

Using the formulae found on [Bruce Bundy's site](http://www.cba-bb.net/Bundy.htm), and a json file of 2016 MLB stats derived from an exported .csv on [Baseball Reference](http://www.baseball-reference.com/), try to create plausible SOM cards.

`npm install`

Change the player name to a corresponding name in the json file.

`node index`

On a batter's card, there are 3 colums of number 1-12, for a total of 108 "chances". For doubles, triples, and homeruns, there can be 1-20 "subchances" as well. In the output, the chances should be spread throughout following various rules.
