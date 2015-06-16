var Universe = require('../core/BaconUniverse.js'),
    ConsoleUtilities = require('./ConsoleUtilities.js');

// While loop
// var INPUT = '0#A 1 + _#B 5 > _ 6 0 ? _ jump @B @A move @A jump';

var INTERVAL = 1000;
// var INPUT = '[ 1 1 1 1 1 1 2 3 7 ] [ _ _ * _#A @A get _ ] 1 reduce _ END'
var INPUT = '1 1 * _#A @A get _'


var stream = Universe.asStream(Universe.fromString(INPUT))
  .bufferingThrottle(INTERVAL);

stream.filter(function (d) { return !(d[0] && d[0] == '<no-more>'); })
  .onValue(ConsoleUtilities.printUniverse)

stream.filter(function (d) { return (d[0] && d[0] == '<no-more>'); })
  .onValue(function () { return process.exit(); })
