var Bacon = require('baconjs'),
    _ = require('lodash'),
    assert = require('assert'),
    Universe = require('./Universe.js'),
    config = require('./config.js'),
    util = require('./util.js');

function printUniverse(universe) {
  var word_beginning_indicis = [];
  var tape = universe.tape;
  var daemon = universe.daemon;


  if (daemon >= tape.length) {
    util.log('DEAD');
    return;
  }

  for (var i = 0, l = tape.length, index = 0; i < l; i++) {
    var wordLength = tape[i].toString().length
    word_beginning_indicis.push({
      index: index,
      length: wordLength
    })

    index += wordLength + 1;
  }

  var daemonWord = word_beginning_indicis[daemon];


  util.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
  util.log(tape.join(' '));
  util.log(
    _.range(daemonWord.index)
      .map(function () { return ' ' }).join('') + 
    _.range(daemonWord.length)
      .map(function () { return '_' }).join(''))
}

function incrementUniverseUntilDone(u0) { 
  var u1 = u0.step();

  resultsBus.push(u1)

  // If the universe is still alive, do it again
  if (u1.alive) incrementerBus.push(u1);

}

function makeTape(d) { return d; }

var inputUniverse = Bacon.fromArray(['0 1 + _ 1 + _ 1 + _ 1 + _ 1 + _ 1 + _ END'.split(' ')])
  .map(makeTape)
  .map(Universe.create);

var metronome = Bacon.sequentially(1000, function (d, i) { return d; })

var incrementerBus = new Bacon.Bus();

var resultsBus = new Bacon.Bus();


// ??

incrementerBus.onValue(incrementUniverseUntilDone)

resultsBus.bufferingThrottle(1000).onValue(printUniverse)



incrementerBus.plug(inputUniverse);