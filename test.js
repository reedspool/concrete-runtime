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
  // 'true 5 4 ? _ END': 'true 5 4 ? 5 END',
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

var inputUniverse = inputBus.map(Universe.create);

incrementerBus.onValue(incrementUniverseUntilDone)

incrementerBus.plug(inputUniverse);



resultsBus.onValue(function (u1) {
  var actual_output = u1.tape.join(' ');
  var original_input = u1.__original.tape.join(' ');
  var expected_output = tests[original_input];

  console.log(actual_output, expected_output);

  assert(actual_output == expected_output, "Output did not match " + actual_output + ' ==> ' + expected_output)
})


_.each(tests, function (expected_output, input) { 
  inputBus.push(input.split(' '))
})