var _ = require('lodash'),
    assert = require('assert'),
    config = require('./config.js'),
    util = require('./util.js'),
    Block = require('./Block.js');

module.exports = Tape

var __proto = new Tape();

function Tape() {}

Tape.create = function (blocks) {
  var tape = Object.create(__proto);

  tape.__blocks = [];
  tape.__history = [];

  tape.spliceArray(0, 0, blocks);

  // There need be an END token
  if ( ! tape.contains('END') ) tape.set(tape.length(), Block.fromString('END'))

  return tape;
}

Tape.fromString = function (codez) { 
  var words = codez.split(' ')
  var blocks = words
                .map(function (w) { return w.toString() })
                .map(Block.fromString);

  return Tape.create(blocks)
}

Tape.prototype.contains = function(word) {
  return this.__blocks.filter(function (d) { 
    return d.matches(word);
  }).length > 0;
}

Tape.prototype.splice = function() {
  this.updateHistory();

  // Pass through
  return [].splice.apply(this.__blocks, arguments);
};

Tape.prototype.spliceArray = function (a, b, c) {
  this.splice.apply(this, [a, b].concat(c))
}

Tape.prototype.get = function(i, n) {
  if (typeof n !== 'undefined') {
    return this.copy().splice(i, n)
  }

  return this.__blocks[i];
};

Tape.prototype.set = function(i, val) {
  this.updateHistory();

  this.__blocks[i] = val;
};

Tape.prototype.length = function() {
  return this.__blocks.length;
};

Tape.prototype.toString = function() {
  return this.__blocks
    .map(function (block) { return block.toString() })
    .join(' ')
};

Tape.prototype.updateHistory = function() {
  this.__history.push(this.toString());
};

Tape.prototype.copy = function() {
  return Tape.create(this.__blocks)
};
