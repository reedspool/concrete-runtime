var util = require('../core/util.js')
var config = require('../core/config.js')
var _ = require('lodash')
var Tape = require('../core/Tape.js')
var Block = require('../core/Block.js')
var Immutable = require('immutable');

function printUniverse(universe) {
  var word_beginning_indicis = [];
  var tape = universe.get('tape');
  var daemonBlock = Tape.getBlock(universe.get('daemon'));
  var daemonIndex;

  var lilConsole = universe.get('extras').get('log') && universe.get('extras').get('log').join('\n')
  var w = util.log;

  if ( ! universe.get('alive') ) {
    w('Done')
    return;
  }

  if (! Tape.inBounds(universe.get('daemon')) ) {
    w('Daemon outside boundaries!')
  }

  var index = 0;
  var sum = 0;

  var loc = Tape.beginning(tape);

  while (Tape.inBounds(loc)) {
    index++;

    var block = Tape.getBlock(loc);
    if(!block || ! daemonBlock) debugger; /* TESTING - Delete me */
    if (Block.matches(block, daemonBlock)) {
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

  if (! Tape.inBounds(universe.get('daemon')) ) {
    w('Daemon outside boundaries!')
    return;
  }

  var daemonWord = word_beginning_indicis[daemonIndex];
if(!daemonWord) debugger; /* TESTING - Delete me */
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

  if (lilConsole) {
    w('My Little Console: ')
    w(lilConsole);
  }

}

module.exports = {
  printUniverse: printUniverse
}