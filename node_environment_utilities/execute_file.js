var Bacon = require('baconjs'),
    Universe = require('../core/Universe.js'),
    config = require('../core/config.js'),
    util = require('../core/util.js'),
    BaconUniverse = require('../core/BaconUniverse.js'),
    ConsoleUtilities = require('./ConsoleUtilities.js'),
    fs = require('fs');

var INTERVAL = 750;
var FILE_NAME = process.argv[2];

fs.readFile(FILE_NAME, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var stream = BaconUniverse.asStream(Universe.fromString(data))
    .bufferingThrottle(INTERVAL);

  stream.filter(function (d) { return !(d[0] && d[0] == '<no-more>'); })
    .onValue(ConsoleUtilities.printUniverse)

  stream.filter(function (d) { return (d[0] && d[0] == '<no-more>'); })
    .onValue(function () { return process.exit(); })
});

