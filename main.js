var Bacon = require('baconjs'),
    _ = require('lodash'),
    assert = require('assert'),
    Universe = require('./Universe.js'),
    config = require('./config.js'),
    util = require('./util.js');

function printUniverse(universe) {
  console.log.bind(console)(universe.tape.join(' '))
  // _.each(universe, util.log)
}

function incrementUniverseUntilDone(u0) { 
  var u1 = u0.step();

  resultsBus.push(u1)

  // Do it again
  if (u1.alive) incrementerBus.push(u1);

}

function makeTape(d) { return d; }

var inputUniverse = Bacon.fromArray(['0 1 + _ 1 + _ 1 + _ 1 + _ 1 + _ 1 + _ END'.split(' ')])
  .map(makeTape)
  .map(Universe.create);

var incrementerBus = new Bacon.Bus();

var resultsBus = new Bacon.Bus();


// ??

incrementerBus.onValue(incrementUniverseUntilDone)

resultsBus.onValue(printUniverse)



incrementerBus.plug(inputUniverse);