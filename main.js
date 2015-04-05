var Bacon = require('baconjs'),
    _ = require('lodash'),
    assert = require('assert'),
    Universe = require('./Universe.js'),
    config = require('./config.js'),
    util = require('./util.js');

var INPUT = '0 1 + _ 5 > _ 5 0 ? _ shift 3 0 copy 0 goto';

function printUniverse(universe) {
  var word_beginning_indicis = [];
  var tape = universe.tape;
  var daemon = universe.daemon;

  if (daemon >= tape.length()) {
    return;
  }

  for (var i = 0, l = tape.length(), index = 0; i < l; i++) {
    var wordLength = tape.get(i).toString().length
    word_beginning_indicis.push({
      index: index,
      length: wordLength
    })

    index += wordLength + 1;
  }

  var daemonWord = word_beginning_indicis[daemon];

  util.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
  util.log(tape.toString());
  util.log(
    _.range(daemonWord.index)
      .map(function () { return ' ' }).join('') + 
    _.range(daemonWord.length)
      .map(function () { return '_' }).join('')
  )
}

function incrementUniverseUntilDone(u0) { 

  resultsBus.push(u0)

  var u1 = u0.step();

  // If the universe is still alive, do it again
  if (u1.alive) incrementerBus.push(u1);

}

var inputBus = new Bacon.Bus();
var incrementerBus = new Bacon.Bus();
var resultsBus = new Bacon.Bus();

var inputUniverse = inputBus.map(Universe.create);

incrementerBus.onValue(incrementUniverseUntilDone)

resultsBus.bufferingThrottle(100).onValue(printUniverse)

incrementerBus.plug(inputUniverse);

inputBus.push(INPUT)