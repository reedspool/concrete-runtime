var Bacon = require('baconjs'),
    Universe = require('./Universe.js'),
    config = require('./config.js'),
    util = require('./util.js'),
    BaconUniverse = require('./BaconUniverse.js'),
    ConsoleUtilities = require('./ConsoleUtilities.js');

// While loop
// var INPUT = '0 1 + _ 10 > _ 5 0 ? _ slide 3 0 copy 0 jump';

var INTERVAL = 60;
var INPUT = '0 1 + _ . "," . _ . -1 0 copy -3 -1 copy 0 1 + _ 15 > _ 4 0 ? _ slide -18 -15 copy 0 jump END'

BaconUniverse.asStream(Universe.fromString(INPUT))
  .bufferingThrottle(INTERVAL)
  .onValue(ConsoleUtilities.printUniverse)
