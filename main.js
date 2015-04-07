var Bacon = require('baconjs'),
    _ = require('lodash'),
    assert = require('assert'),
    Universe = require('./Universe.js'),
    config = require('./config.js'),
    util = require('./util.js'),
    ConsoleUtilities = require('./ConsoleUtilities.js');

// While loop
// var INPUT = '0 1 + _ 10 > _ 5 0 ? _ slide 3 0 copy 0 jump';

var INTERVAL = 60;
var INPUT = '0 1 + _ . , . _ . 1 0 copy 3 1 copy 0 1 + _ 20 > _ 5 0 ? _ slide 18 15 copy 0 jump'

var universeStream = Bacon.fromBinder(function(sink) {
  var universe = Universe.fromString(INPUT)

  while (universe.alive) {
    sink(universe.copy())
    universe = universe.step();
  }

  return function() {
    
  };
});

var resultsBus = new Bacon.Bus();

resultsBus.plug(universeStream)

resultsBus.bufferingThrottle(INTERVAL)
  .onValue(ConsoleUtilities.printUniverse)
