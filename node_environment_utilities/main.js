var Bacon = require('baconjs'),
    Universe = require('../core/Universe.js'),
    config = require('../core/config.js'),
    util = require('../core/util.js'),
    BaconUniverse = require('../core/BaconUniverse.js'),
    ConsoleUtilities = require('./ConsoleUtilities.js');

// While loop
// var INPUT = '0#A 1 + _#B 5 > _ 6 0 ? _ jump @B @A move @A jump';

var INTERVAL = 1;
var INPUT = '2 3 [ _ _ + _#A . @A get _ ] call _'

var stream = BaconUniverse.asStream(Universe.fromString(INPUT))
  .bufferingThrottle(INTERVAL);

stream.filter(function (d) { return !(d[0] && d[0] == '<no-more>'); })
  .onValue(ConsoleUtilities.printUniverse)

stream.filter(function (d) { return (d[0] && d[0] == '<no-more>'); })
  .onValue(function () { return process.exit(); })
