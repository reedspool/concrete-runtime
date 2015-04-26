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
    Universe = require('./Universe.js'),
    config = require('./config.js'),
    util = require('./util.js'),
    BaconUniverse = require('./BaconUniverse.js');

var tests = {

  // Basic ops and values
  '3 2 + _ END': '3 2 + 5 END',
  '3 2 - _ END': '3 2 - 1 END',
  '3 2 * _ END': '3 2 * 6 END',
  '3 2 / _ END': '3 2 / 1.5 END',
  '3 2 > _ END': '3 2 > true END',
  '3 2 < _ END': '3 2 < false END',
  'true 5 4 ? _ END': 'true 5 4 ? 5 END',

  // Any kidn of whitespace will do
  '3 2 +        _ END': '3 2 +        5 END',
  '3 2 +   \t\n     _ END': '3 2 +   \t\n     5 END',

  // Sequences of ops
  '0 1 + _ 1 + _ 1 + _ 1 + _ 1 + _ 1 + _ END':
    '0 1 + 1 1 + 2 1 + 3 1 + 4 1 + 5 1 + 6 END',

  '3 4 + _ 5 > _ bigger smaller ? _ END':
    '3 4 + 7 5 > true bigger smaller ? bigger END',

  // Fibs
  '0 1 + _ . , . _ . -1 0 copy -3 -1 copy 0 1 + _ 20 > _ 5 0 ? _ slide -18 -15 copy 0 jump END':
    '10946 17711 + 17711 . , . _ . -1 0 copy -3 -1 copy 20 1 + 21 20 > true 5 0 ? 5 slide -18 -15 copy 0 jump END',

  // While loop
  '0 1 + _ 5 > _ 5 0 ? _ slide -3 0 copy 0 jump END':
    '5 1 + 6 5 > true 5 0 ? 5 slide -3 0 copy 0 jump END',

  // Names
  '4#A A get _ END': '4#A A get 4 END',

  // Fibs with names... lots of philosphical problems when you introduce names...
  '0#A 1#B + _#C C . , . _ . B A move C B move 0#I 1 + _#J 20 > _ 5 0 ? _ slide J I move 0 jump END':
    '10946#A 17711#B + 17711#C C . , . _ . B A move C B move 20#I 1 + 21#J 20 > true 5 0 ? 5 slide J I move 0 jump END',
}

Bacon.fromArray(_.keys(tests))
  .map(Universe.fromString)
  .flatMapLatest(function (universe) {
    return BaconUniverse.asStream(universe)
  })
  .filter(function (u1) { return ! u1.alive })
  .onValue(function (u1) {
    var actual_output = u1.tape.toString();
    var original_input = u1.__original.tape.toString();
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

