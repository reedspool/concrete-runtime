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
  u.daemon = Tape.beginning(u.tape);

  u.log = [];

  u.history = [];

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
  var steps = this.stepsTaken++;

  this.record();

  var daemon = this.daemon;

  if ( ! Tape.inBounds(daemon) ||
    steps >= config.MAX_UNIVERSE_STEPS) {

    if (steps >= config.MAX_UNIVERSE_STEPS) {
      util.log("Maximum allowed steps exceeded, good bye.")
    }

    if ( ! Tape.inBounds(daemon) ) {
      util.log("Tape out of bounds :-/")
      util.log(daemon)
    }

    copy.alive = false;
    return copy;
  };
  
  // Get code at location
  // TODO: Daemon must be an internal address, so get will not do.
  var block = Tape.getBlock(daemon);

  var blockInfo = Block.getInfo(block);

  var inputs = Tape.getBlocks(daemon, blockInfo.inputs * -1)
                  .map(Block.getValue);

  var sideEffects = this.sideEffects();

  if (blockInfo.sideEffects) {
    blockInfo.op(inputs, _.extend(sideEffects, accessors);
  } else {
    // Reduce privilege to only output
    blockInfo.op(inputs, _.extend({
      output: sideEffects.output
    }, accessors))
  }

  daemon = Tape.next(daemon);

  return this;
}

Universe.prototype.sideEffects = function () { 
  var self = this;

  return {
    end: function () {
      self.alive = false;
    }, 
    jump: function (handleOrOffset) {
      self.daemon = Tape.handleOrOffset(self.daemon, handleOrOffset);
    },
    writeFromTo: function (source, destination) { 
      self.tape = Tape.set(destination, Tape.get(source))
    },
    output: function (output) {
      self.tape = Tape.spliceArray(Tape.next(self.daemon), output.length, output)
    },
    println: function (input) {
      self.println(input.toString())
    },
    print: function (input) {
      self.print(input.toString())
    },
  }
}

Universe.prototype.record = function () {
  this.history.push(this.tape);
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

Universe.prototype.alive = true;

