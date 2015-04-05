var _ = require('lodash'),
    assert = require('assert'),
    config = require('./config.js'),
    util = require('./util.js');

module.exports = Tape

var __proto = new Tape();

function Tape() {}

Tape.create = function (arr) {
  var tape = Object.create(__proto);

  tape.__arr = [];
  tape.__history = [];

  tape.spliceArray(0, 0, arr);

  // There need be an END token
  if ( ! tape.contains('END') ) tape.set(tape.length(), 'END')

  return tape;
}

Tape.fromString = function (codez) { 
  return Tape.create(codez.split(' '))
}

Tape.prototype.contains = function(word) {
  return this.__arr.indexOf(word) != -1;
}

Tape.prototype.splice = function() {
  this.updateHistory();

  // Pass through
  return [].splice.apply(this.__arr, arguments);
};

Tape.prototype.spliceArray = function (a, b, c) {
  this.splice.apply(this, [a, b].concat(c))
}

Tape.prototype.get = function(i, n) {
  if (typeof n !== 'undefined') {
    return this.copy().splice(i, n)
  }

  return this.__arr[i];
};

Tape.prototype.set = function(i, val) {
  this.updateHistory();

  this.__arr[i] = val;
};

Tape.prototype.length = function() {
  return this.__arr.length;
};

Tape.prototype.toString = function() {
  return this.__arr.join(' ')
};

Tape.prototype.updateHistory = function() {
  this.__history.push(this.toString());
};

Tape.prototype.copy = function() {
  return Tape.create(this.__arr)
};
