/*- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -~- -*/
/*
/* Unit tests
/*
/* Author: [Reed](https://github.com/reedspool)
/*
/*- -~- -*/
var Bacon = require('baconjs'),
    _ = require('lodash'),
    assert = require('assert'),
    concrete = require('../concrete');
    config = concrete.config,
    util = concrete.util,
    Tape = concrete.Tape,
    BaconUniverse = concrete.BaconUniverse;

var tests = {

  // Basic ops and values
  '3 2 + _ END': '3 2 + 5 END',
  '3 2 - _ END': '3 2 - 1 END',
  '3 2 * _ END': '3 2 * 6 END',
  '4 2 / _ END': '4 2 / 2 END',
  '3 2 > _ END': '3 2 > "Greater Than" END',
  '3 2 < _ END': '3 2 < !"Not Less Than" END',
  '"true" 5 4 ? _ END': '"true" 5 4 ? 5 END',

  // Newlines are no problem
  '"true" 5 4\n ? _ END': '"true" 5 4 ? 5 END',

  // Any kind of whitespace will do
  '3 2 +        _ END': '3 2 +        5 END',
  '3 2 +   \t\n     _ END': '3 2 +   \t\n     5 END',

  // Sequences of ops
  '0 1 + _ 1 + _ 1 + _ 1 + _ 1 + _ 1 + _ END':
    '0 1 + 1 1 + 2 1 + 3 1 + 4 1 + 5 1 + 6 END',

  '3 4 + _ 5 > _ "bigger" "smaller" ? _ END':
    '3 4 + 7 5 > "Greater Than" "bigger" "smaller" ? "bigger" END',

  // Fibs
  '0#A 1#B + _#C . ", " . @B @A move @C @B move 0#I 1 + _#J 20 > _ @FIN 1 ? _ jump @J @I move @A jump END#FIN':
    '10946#A 17711#B + 17711#C . ", " . @B @A move @C @B move 20#I 1 + 21#J 20 > "Greater Than" @FIN 1 ? @FIN jump @J @I move @A jump END#FIN',

  // While loop
  '0#A 1 + _#B 5 > _ 6 1 ? _ jump @B @A move @A jump END':
    '5#A 1 + 6#B 5 > "Greater Than" 6 1 ? 6 jump @B @A move @A jump END',

  // Names
  '4#A @A get _ END': '4#A @A get 4 END',

  // Composed Folds parse
  "[ 3 3 [ 4 4 ] 3 ] END": "[ 3 3 [ 4 4 ] 3 ] END",

  // Call
  "2 3 [ _ _ * _ ] call _ END": "2 3 [ _ _ * _ ] call 6 END",

  // Reduce
  "[ 1 1 1 1 1 1 2 3 7 ] [ _ _ * _ ] 1 reduce _ END":
    "[ 1 1 1 1 1 1 2 3 7 ] [ _ _ * _ ] 1 reduce 42 END",

  // Reduce with names
  "[ 1 1 1 1 1 1 2 3 7 ] [ _ _ * _#A @A get _ ] 1 reduce _ END":
    "[ 1 1 1 1 1 1 2 3 7 ] [ _ _ * _#A @A get _ ] 1 reduce 42 END"
}

Bacon.fromArray(_.keys(tests))
  .map(BaconUniverse.fromString)
  .flatMapLatest(function (universe) {
    return BaconUniverse.asBlockingStream(universe)
  })
  .filter(function (u1) { return  !(u1[0] && u1[0] == '<no-more>'); })
  .filter(function (u1) { return u1 && ! u1.get('alive') })
  .bufferingThrottle(60)
  .onValue(function (u1) {
    if(true) debugger; /* TESTING - Delete me */
    var actual_output = Tape.toString(u1.get('tape'));
    var original_input = Tape.toString(u1.get('history').get(0));
    var expected_output = tests[original_input];
    var str =
      '\n' +
      original_input +
      '\n should be \n' +
      expected_output +
      '\n and was \n' +
      actual_output
    assert(actual_output == expected_output,
      "\n\nOutput did not match " + str)

    util.log('\n\nMatch: ' + str)
  });

