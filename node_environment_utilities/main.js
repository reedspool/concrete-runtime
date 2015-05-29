var Universe = require('../core/Universe.js'),
    BaconUniverse = require('../core/BaconUniverse.js'),
    ConsoleUtilities = require('./ConsoleUtilities.js');

// While loop
// var INPUT = '0#A 1 + _#B 5 > _ 6 0 ? _ jump @B @A move @A jump';

var INTERVAL = 60;
var INPUT = '0#A 1#B + _#C . "," . _ . @B @A move @C @B move 0#I 1 + _#J 20 > _ 6 0 ? _ jump @J @I move @A jump END'

var stream = BaconUniverse.asStream(Universe.fromString(INPUT))
  .bufferingThrottle(INTERVAL);

stream.filter(function (d) { return !(d[0] && d[0] == '<no-more>'); })
  .onValue(ConsoleUtilities.printUniverse)

stream.filter(function (d) { return (d[0] && d[0] == '<no-more>'); })
  .onValue(function () { return process.exit(); })
