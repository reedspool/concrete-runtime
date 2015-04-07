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
  '3 2 > _ END': '3 2 > true END',
  'true 5 4 ? _ END': 'true 5 4 ? 5 END',

  // Sequences of ops
  '0 1 + _ 1 + _ 1 + _ 1 + _ 1 + _ 1 + _ END':
    '0 1 + 1 1 + 2 1 + 3 1 + 4 1 + 5 1 + 6 END',

  '3 4 + _ 5 > _ bigger smaller ? _ END':
    '3 4 + 7 5 > true bigger smaller ? bigger END',

  // Fibs
  '0 1 + _ . , . _ . 1 0 copy 3 1 copy 0 1 + _ 20 > _ 5 0 ? _ slide 18 15 copy 0 jump END':
    '10946 17711 + 17711 . , . _ . 1 0 copy 3 1 copy 20 1 + 21 20 > true 5 0 ? 5 slide 18 15 copy 0 jump END',

  // While loop
  '0 1 + _ 5 > _ 5 0 ? _ slide 3 0 copy 0 jump END':
    '5 1 + 6 5 > true 5 0 ? 5 slide 3 0 copy 0 jump END',

  // Names
  // '4#A A _ END': '4#A A 4 END'

  // Fibs with names... lots of philosphical problems when you introduce names...
  // '0#A 1#B + _#C C print , . _ . B A copy C B copy 0#I 1 + _#J 20 > _ 5 0 ? _ slide J I copy A jump':
  //   '10946 17711 + 17711 . , . _ . 1 0 copy 3 1 copy 20 1 + 21 20 > true 5 0 ? 5 slide 18 15 copy 0 jump END',
}

Bacon.fromArray(_.keys(tests)).flatMapLatest(function (input) { 
  var universeStream = BaconUniverse.asStream(Universe.fromString(input))
    return universeStream
}).filter(function (u1) {
 return ! u1.alive
}).onValue(function (u1) {
  var actual_output = u1.tape.toString();
  var original_input = u1.__original.tape.toString();
  var expected_output = tests[original_input];
  util.log(actual_output, expected_output);
  util.log(original_input)
  assert(actual_output == expected_output, "Output did not match " + actual_output + ' ==> ' + expected_output)
});

