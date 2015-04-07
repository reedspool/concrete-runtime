var _ = require('lodash'),
    assert = require('assert'),
    config = require('./config.js'),
    util = require('./util.js'),
    Tape = require('./Tape.js')
    ConsoleUtilities = require('./ConsoleUtilities.js');

function Universe() {}
module.exports = Universe
var __proto = new Universe();

Universe.create = function (tape) {
  var u = Object.create(__proto);

  u.tape = tape;
  u.__original = u;

  // For now, a daemon is just a location
  u.daemon = 0;

  u.log = [];

  return u;
}

Universe.fromString = function (codez) {
  var tape = Tape.fromString(codez);

  return Universe.create(tape);
}

/**
 * Step the universe exactly once.
 */

Universe.prototype.stepsTaken = 0;

Universe.prototype.step = function () {
  this.stepsTaken++;

  var copy = this.copy();

  if (copy.daemon >= copy.tape.length() ||
    this.stepsTaken >= config.MAX_UNIVERSE_STEPS) {

    if (this.stepsTaken >= config.MAX_UNIVERSE_STEPS) {
      util.log("Maximum allowed steps exceeded, good bye.")
    }

    copy.alive = false;
    return copy;
  };
  
  // Get code at location
  var block = copy.tape.get(copy.daemon);

  var codeInfo = block.info;

  var inputBegin = copy.daemon - codeInfo.inputs;
  var inputs = copy.tape.get(inputBegin, copy.daemon - inputBegin);


  var sideEffects = copy.sideEffects();

  if (codeInfo.sideEffects) {
    codeInfo.op(inputs, sideEffects);
  } else {
    codeInfo.op(inputs, sideEffects.output)
  }

  copy.daemon++;

  return copy;
}

Universe.prototype.sideEffects = function () { 
  var self = this;

  return {
    end: function () {
      self.alive = false;
    }, 
    jump: function (location) { 
      self.daemon = location;
    }, 
    slide: function (offset) { 
      self.daemon += offset;
    }, 
    writeFromTo: function (source, destination) { 
      self.tape.set(destination, self.tape.get(source))
    },
    output: function (output) {
      self.tape.spliceArray(self.daemon + 1, output.length, output)
    },
    println: function (input) {
      self.println(input.toString())
    },
    print: function (input) {
      self.print(input.toString())
    },
  }
}

Universe.prototype.println = function (input) {
  input = input.replace('_', ' ')
  this.log.push(input)
}

Universe.prototype.print = function (input) {
  var last = this.log.pop() || '';

  last += input;

  this.println(last);
}

Universe.prototype.copy = function () { 
  var u1 = Object.create(__proto)

  u1.tape = this.tape.copy();
  u1.daemon = this.daemon;
  u1.alive = this.alive;
  u1.__original = this.__original;
  u1.stepsTaken = this.stepsTaken;
  u1.log = this.log.slice();

  return u1;
}

Universe.prototype.alive = true;

