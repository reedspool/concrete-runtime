var Bacon = require('baconjs'),
    Universe = require('./Universe.js'),
    config = require('./config.js'),
    util = require('./util.js'),
    BaconUniverse = require('./BaconUniverse.js'),
    ConsoleUtilities = require('./ConsoleUtilities.js'),
    fs = require('fs');

var INTERVAL = 60;
var FILE_NAME = process.argv[2];

fs.readFile(FILE_NAME, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }



  BaconUniverse.asStream(Universe.fromString(data))
    .bufferingThrottle(INTERVAL)
    .onValue(ConsoleUtilities.printUniverse)
});

