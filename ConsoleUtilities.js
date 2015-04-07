var util = require('./util.js')
var _ = require('lodash')

function printUniverse(universe) {
  var word_beginning_indicis = [];
  var tape = universe.tape;
  var daemon = universe.daemon;
  var lilConsole = universe.log.join('\n')
  var w = util.log;

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