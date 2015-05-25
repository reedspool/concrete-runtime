var _ = require('lodash'),
    assert = require('assert'),
    config = require('./config.js'),
    util = require('./util.js'),
    Tape = require('./Tape.js'),
    Block = require('./Block.js'),
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

  this.alive = true;

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

  if ( ! this.alive ) {
    util.log("Can't step further, I'm done!")
    return this;
  }

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

    this.alive = false;
    return this;
  };
  
  // Get code at location
  var block = Tape.getBlock(daemon);

  var blockInfo = Block.getInfo(block);

  if (typeof blockInfo == 'function') blockInfo = blockInfo({
    location: daemon
  });

  if ( ! blockInfo ) {
    util.log('Couldn\'t execute block ' + Block.toString(block))

    this.alive = false;
    return this;
  }

  var inputs = blockInfo.inputs == 0
                ? []
                : Tape.getBlocks(daemon, blockInfo.inputs * -1)
                    .map(Block.getValue);

  var sideEffects = this.sideEffects();
  var accessors = this.accessors();

  if (blockInfo.sideEffects) {
    blockInfo.op(inputs, _.extend(sideEffects, accessors));
  } else {
    // Reduce privilege to only output
    blockInfo.op(inputs, _.extend({
      output: sideEffects.output
    }, accessors))
  }

  // If the daemon's been moved already, then don't move it
  this.daemon = this.daemon == daemon
                ? Tape.next(this.daemon)
                : this.daemon;

  this.daemon = this.daemon.set('tape', this.tape);

  return this;
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
    writeFromTo: function (source, destination) { 
      self.tape = Tape.setBlock(destination, Tape.getBlock(source))
    },
    output: function (output) {
      if (! output.length ) output = [output]

      self.tape = Tape.setBlocks(Tape.next(self.daemon), output)
    },
    println: function (input) {
      self.println(input.toString())
    },
    print: function (input) {
      self.print(input.toString())
    }
  }
}

Universe.prototype.accessors = function () {
  var self = this;

  return {
    handleOrOffsetLocation: function (handleOrOffset) {
      return Tape.getLocationFromHandleOrOffset(self.tape, handleOrOffset, self.daemon);
    },
    valueAtLocation: function (location) { 
      return Tape.getBlock(location);
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

