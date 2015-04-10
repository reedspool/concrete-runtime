var util = require('./util.js')
var config = require('./config.js')
var _ = require('lodash')
var Block = require('./Block.js')

function printUniverse(universe) {
  var word_beginning_indicis = [];
  var tape = universe.tape;
  var daemon = universe.tape.getAddressIndex(universe.daemon);
  var lilConsole = universe.log.join('\n')
  var w = util.log;

  if ( ! universe.alive ) {
    w('Done')
    return;
  }

  if (! tape.inBounds(universe.daemon) ) {
    w('Daemon outside boundaries!')
  }

  var index = 0;

  tape.forEach(function (block, i) {
    var wordLength = block.toString().length
    word_beginning_indicis[i] = {
      index: index,
      length: wordLength
    }

    index += wordLength + 1;
  });

  var daemonWord = word_beginning_indicis[daemon];

  w('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
  w(tape.toString());
  w(
    _.range(daemonWord.index)
      .map(function () { return ' ' }).join('') + 
    _.range(daemonWord.length)
      .map(function () { return '_' }).join('')
  )

  w('\n');
  w('My Little Console: ')
  w(lilConsole);

}

module.exports = {
  printUniverse: printUniverse
}