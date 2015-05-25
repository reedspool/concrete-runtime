var Bacon = require('baconjs'),
    Universe = require('./Universe.js'),
    config = require('./config.js'),
    util = require('./util.js'),
    BaconUniverse = require('./BaconUniverse.js'),
    ConsoleUtilities = require('./ConsoleUtilities.js');

// While loop
// var INPUT = '0 1 + _ 10 > _ 5 0 ? _ slide 3 0 copy 0 jump';

var INTERVAL = 60;
var INPUT =   '0#A 1 + _#B 5 > _ 6 0 ? _ jump @B @A move @A jump'

BaconUniverse.asStream(Universe.fromString(INPUT))
  .filter(function (d) { return !(d[0] && d[0] == '<no-more>'); })
  .bufferingThrottle(INTERVAL)
  .onValue(ConsoleUtilities.printUniverse)
