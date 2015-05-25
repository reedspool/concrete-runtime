var util = require('./util.js')
var config = require('./config.js')
var _ = require('lodash')
var Tape = require('./Tape.js')
var Block = require('./Block.js')

function printUniverse(universe) {
  if(!universe.daemon) debugger; /* TESTING - Delete me */
  var word_beginning_indicis = [];
  var tape = universe.tape;
  var daemonBlock = Tape.getBlock(universe.daemon);
  var daemonIndex;
  var lilConsole = universe.log.join('\n')
  var w = util.log;

  if ( ! universe.alive ) {
    w('Done')
    return;
  }

  if (! Tape.inBounds(universe.daemon) ) {
    w('Daemon outside boundaries!')
  }

  var index = 0;
  var sum = 0;

  var loc = Tape.beginning(tape);

  while (Tape.inBounds(loc)) {
    index++;

    var block = Tape.getBlock(loc);

    if (block == daemonBlock) {
      daemonIndex = index
    }
    
    var info = word_beginning_indicis[index] = {
      sumSoFar: sum,
      length: Block.toString(block).length,
      nameLength: block.get('name') ? block.get('name').length + 1 : 0
    }

    sum += info.length + 1 + info.nameLength;

    loc = Tape.next(loc)
  }

  var daemonWord = word_beginning_indicis[daemonIndex];

  w('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
  w(Tape.toString(tape));
  w(
    _.range(daemonWord.sumSoFar)
      .map(function () { return ' ' }).join('') + 
    _.range(daemonWord.length)
      .map(function () { return '_' }).join('')
  )

  w('\n');
  w('Daemon at ' + daemonIndex + ' which is ' + daemonWord.sumSoFar)
  w('\n');
  w('My Little Console: ')
  w(lilConsole);

}

module.exports = {
  printUniverse: printUniverse
}