var _ = require('lodash'),
    assert = require('assert'),
    config = require('./config.js'),
    util = require('./util.js'),
    Tape = require('./Tape.js');

function Universe() {}
module.exports = Universe
var __proto = new Universe();

Universe.create = function (codez) {
  var u = Object.create(__proto);
  var tape = Tape.fromString(codez);

  u.tape = tape;
  u.__original = u;

  // For now, a daemon is just a location
  u.daemon = 0;

  return u;
}

/**
 * Step the universe exactly once.
 */

Universe.prototype.stepsTaken = 0;

Universe.prototype.step = function () {
  this.stepsTaken++;

  var copy = this.copy();
  var t1 = copy.tape;
  var daemon = copy.daemon;

  if (daemon >= t1.length() ||
    this.stepsTaken >= config.MAX_UNIVERSE_STEPS) {
    copy.alive = false;
    return copy;
  };
debugger
  // Get code at location
  var block = t1.get(daemon);

  var codeInfo = block.info;

  var inputBegin = daemon - codeInfo.inputs;
  var inputEnd = daemon
  var inputs = t1.get(inputBegin, inputEnd - inputBegin);


  var outputBegin = daemon + 1;

  copy.daemon++;

  var sideEffects = {
    end: function () {
      copy.alive = false;
    }, 
    goto: function (location) { 
      copy.daemon = location;
    }, 
    shift: function (offset) { 
      copy.daemon += offset;
    }, 
    writeFromTo: function (from, to) { 
      t1.set(to, t1.get(from))
    },
    output: function (output) {
      copy.tape.spliceArray(outputBegin, output.length, output)
    }
  }

  if (codeInfo.sideEffects) {
    codeInfo.op(inputs, sideEffects);
  } else {
    codeInfo.op(inputs, sideEffects.output)
  }

  return copy;
}

Universe.prototype.copy = function () { 
  var u1 = Object.create(__proto)

  u1.tape = this.tape.copy();
  u1.daemon = this.daemon;
  u1.alive = this.alive;
  u1.__original = this.__original;
  u1.stepsTaken = this.stepsTaken;

  return u1;
}

Universe.prototype.alive = true;

