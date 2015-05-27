var Universe = require('./core/Universe.js'),
    Tape = require('./core/Tape.js'),
    BaconUniverse = require('./core/BaconUniverse.js');

var INTERVAL = 1;
var INPUT = '2 3 [ _ _ + _#A . @A get _ ] call _';

var stream = BaconUniverse.asStream(Universe.fromString(INPUT))
  .bufferingThrottle(INTERVAL);

stream.filter(function (d) { return !(d[0] && d[0] == '<no-more>'); })
  .map(function (u) { return Tape.toString(u.tape) })
  .onValue($().html.bind($('body')));

stream.filter(function (d) { return (d[0] && d[0] == '<no-more>'); })
  .onValue(function () { return alert('End') });
