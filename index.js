var fs = require('fs')
var _ = require('lodash')
var player = require('./player')
var card = require('./card')
var PDFDocument = require('pdfkit')

var player_stats = player("Kris Bryant")
var player_card = card(player_stats)
var text_list = []

//loop through player card and make a list of all results
_.forEach(player_card, function(value) {
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
doc.pipe(fs.createWriteStream(_.snakeCase(player_stats.name) + '.pdf'))

doc.image('baseball.jpg', 150, 9, {fit: [30, 225]})

//box 1
doc.rect(9, 72, 66, 18)
.fillOpacity(0.2)
.fill('#cadcf9') 
.fontSize(12)
.fill('black')
.text('1', 38, 76)

//box 2
doc.rect(75, 72, 66, 18)
.fillOpacity(0.2)
.fill('#cadcf9')
.fontSize(12)
.fill('black')
.text('2', 104, 76)
//box 3
doc.rect(141, 72, 66, 18)
.fillOpacity(0.2)
.fill('#cadcf9')
.fontSize(12)
.fill('black')
.text('3', 170, 76)

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
.text(player_stats.positions[0], {align:'center'})

//stealing
doc.fontSize(8)
.moveUp()
.font('Helvetica')
.text('stealing-' + player_stats.som_steal, {align:'right'})
.moveDown(0.2)
.text('running ' + player_stats.som_run, {align:'right'})

//BATTING RECORD
doc.fontSize(8)
.font('Helvetica-Bold')
.text('BATTING RECORD', 12, 311, {align:'center'})

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



//column 1
//2
doc.fontSize(8)
.fill('black')
.font('Helvetica-Bold')
.text('2-', 12, 96, {continued: true, width: 60})
.font('Helvetica')
.text(text_list[0])

//3
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('3-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[1])

//4
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('4-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[2])

//5
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('5-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[3])

//6
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('6-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[4])

//7
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('7-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[5])

//8
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('8-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[6])

//9
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('9-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[7])

//10
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('10-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[8])

//11
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('11-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[9])

//12
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('12-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[10])

//column 2
//2
doc.fontSize(8)
.font('Helvetica-Bold')
.text('2-', 78, 96, {continued: true, width: 60})
.font('Helvetica')
.text(text_list[11])

//3
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('3-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[12])

//4
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('4-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[13])

//5
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('5-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[14])

//6
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('6-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[15])

//7
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('7-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[16])

//8
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('8-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[17])

//9
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('9-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[18])

//10
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('10-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[19])

//11
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('11-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[20])

//12
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('12-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[21])

//column 3
//2
doc.fontSize(8)
.font('Helvetica-Bold')
.text('2-', 144, 96, {continued: true, width: 60})
.font('Helvetica')
.text(text_list[22])

//3
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('3-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[23])

//4
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('4-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[24])

//5
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('5-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[25])

//6
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('6-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[26])

//7
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('7-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[27])

//8
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('8-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[28])

//9
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('9-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[29])

//10
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('10-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[30])

//11
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('11-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[31])

//12
doc.fontSize(8)
.moveDown(0.2)
.font('Helvetica-Bold')
.text('12-',{continued: true, width: 60})
.font('Helvetica')
.text(text_list[32])



doc.end()