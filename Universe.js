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

  // For now, a daemon is just a location
  u.daemon = u.tape.getHandleAddress('FIRST');

  u.log = [];

  u.__original = u;

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

  if ( ! copy.tape.inBounds(copy.daemon) ||
    this.stepsTaken >= config.MAX_UNIVERSE_STEPS) {

    if (this.stepsTaken >= config.MAX_UNIVERSE_STEPS) {
      util.log("Maximum allowed steps exceeded, good bye.")
    }

    copy.alive = false;
    return copy;
  };
  
  // Get code at location
  // TODO: Daemon must be an internal address, so get will not do.
  var block = copy.tape.get(copy.daemon);

  var codeInfo = block.info;

  // REWRITE w Static Block 
  var inputs = copy.tape.get( copy.daemon, - codeInfo.inputs);

  var sideEffects = copy.sideEffects();

  if (codeInfo.sideEffects) {
    codeInfo.op(inputs, sideEffects);
  } else {
    codeInfo.op(inputs, sideEffects.output)
  }

  copy.daemon = copy.tape.next(copy.daemon);

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
      self.daemon = self.tape.next(self.daemon, offset);
    },
    writeFromTo: function (source, destination) { 
      self.tape.set(destination, self.tape.get(source))
    },
    valueAtAddress: function (source) { 
      return self.tape.get(source);
    },
    handleAddress: function (handle) { 
      return self.tape.getHandleAddress(handle);
    },
    valueAtHandle: function (handle) { 
      return self.tape.get(self.tape.getHandleAddress(handle));
    },
    output: function (output) {
      self.tape.spliceArray(self.tape.next(self.daemon), output.length, output)
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

