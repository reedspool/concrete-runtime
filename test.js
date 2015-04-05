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
    util = require('./util.js');

var tests = {
  '0 1 + _ 1 + _ 1 + _ 1 + _ 1 + _ 1 + _ END':
    '0 1 + 1 1 + 2 1 + 3 1 + 4 1 + 5 1 + 6 END',

  '3 2 + _ END': '3 2 + 5 END',
  '3 2 > _ END': '3 2 > true END',
  'true 5 4 ? _ END': 'true 5 4 ? 5 END',
  '0 1 + _ 5 > _ 5 0 ? _ shift 3 0 copy 0 goto END':
    '5 1 + 6 5 > true 5 0 ? 5 shift 3 0 copy 0 goto END',
  '3 4 + _ 5 > _ bigger smaller ? _ END': '3 4 + 7 5 > true bigger smaller ? bigger END'
  //   // 'ptr{-1} END': '! Never terminates END',
  // '4#A A _ END': '4#A A 4 END'

}


function incrementUniverseUntilDone(u0) { 
  var u1 = u0.step();


  // If the universe is still alive, do it again
  if (u1.alive){
    incrementerBus.push(u1);
  } else {
    resultsBus.push(u1)
  }

}

var inputBus = new Bacon.Bus();
var incrementerBus = new Bacon.Bus();
var resultsBus = new Bacon.Bus();

incrementerBus.onValue(incrementUniverseUntilDone);

resultsBus.onValue(function (u1) {
  var actual_output = u1.tape.toString();
  var original_input = u1.__original.tape.toString();
  var expected_output = tests[original_input];
  util.log(original_input, actual_output, expected_output);
  assert(actual_output == expected_output, "Output did not match " + actual_output + ' ==> ' + expected_output)
})

incrementerBus.plug(inputBus.map(Universe.create));

_.each(tests, function (expected_output, input) { 
  inputBus.push(input)
})