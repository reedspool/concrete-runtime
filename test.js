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



  '3 2 + _ END': '3 2 + 6 END',
  '3 2 > _ END': '3 2 > true END',
  // 'true 5 4 ? _ END': 'true 5 4 ? 5 END',
  //   // 'ptr{-1} END': '! Never terminates END',
  // '4#A A _ END': '4#A A 4 END'

}

_.each(tests, function (output, input) { 
  Bacon.fromArray(input)
    .map(Universe.create);

})