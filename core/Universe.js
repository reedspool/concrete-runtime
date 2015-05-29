var _ = require('lodash'),
    assert = require('assert'),
    config = require('./config.js'),
    util = require('./util.js'),
    Tape = require('./Tape.js'),
    Block = require('./Block.js'),
    Immutable = require('immutable');
function Universe() {}
module.exports = Universe
var __proto = new Universe();

Universe.create = function (tape) {
  var u = Immutable.Map({})

  u = u.set('tape', tape)
  u = u.set('daemon', Tape.beginning(u.tape))
  u = u.set('tape', tape)
  u = u.set('log', [])
  u = u.set('history', [])
  u = u.set('alive', true)
  u = u.set('stepsTaken', 0)

  return u;
}

Universe.die = function (universe) {
  return universe.set('alive', false)
}

Universe.fromString = function (codez) {
  var tape = Tape.fromString(codez);

  return Universe.create(tape);
}

/**
 * Step the universe exactly once.
 */

Universe.step = function (universe) {
  var steps = universe.get('stepsTaken')

  if ( ! universe.get('alive') )
    util.log("Can't step further, I'm done!")
    return universe;
  }

  universe = Universe.record(universe);

  var daemon = universe.get('daemon')

  if ( ! Tape.inBounds(daemon) ||
    steps >= config.MAX_UNIVERSE_STEPS) {

    if (steps >= config.MAX_UNIVERSE_STEPS) {
      util.log("Maximum allowed steps exceeded, good bye.")
    }

    if ( ! Tape.inBounds(daemon) ) {
      util.log("Tape out of bounds :-/")
      util.log(daemon)
    }

    universe = Universe.die(universe);
    return universe;
  };
  
  // Get code at location
  var block = Tape.getBlock(daemon);

  if ( ! block || ! block.get('code') )  {
    util.log('Error reading tape: ' + Block.toString(block))
    util.log(Tape.toString(universe.get('tape')))

    universe = Universe.die(universe);
    return universe;
  }

  var blockInfo = Block.getInfo(block);

  if (typeof blockInfo == 'function') blockInfo = blockInfo({
    left: Tape.getBlocks(Tape.beginning(universe.get('tape')), daemon.get('offset'))
  });

  if ( ! blockInfo ) {
    util.log('Couldn\'t execute block ' + Block.toString(block))

    universe = Universe.die(universe);
    return universe;
  }

  var inputs = blockInfo.inputs == 0
                ? Immutable.List()
                : Tape.getBlocks(daemon, blockInfo.inputs * -1)
                    .map(Block.getValue);

  var sideEffects = Universe.sideEffects(universe);
  var accessors = Universe.accessors(universe);

  if (blockInfo.sideEffects) {
    blockInfo.op(inputs, _.extend(sideEffects, accessors));
  } else {
    // Reduce privilege to only output
    blockInfo.op(inputs, _.extend({
      output: sideEffects.output
    }, accessors))
  }

  // If the daemon's been moved already, then don't move it
  var nextDaemon = universe.get('daemon') == daemon
                    ? Tape.next(universe.get('daemon'))
                    : universe.get('daemon')

  nextDaemon = nextDaemon.set('tape', universe.get('tape'));
  universe = universe.set('daemon', nextDaemon);

  // Does immutablejs have an atomic increment?
  universe = universe.set('stepsTaken', universe.get('stepsTaken')++)

  return universe
}

Universe.sideEffects = function (universe) { 
  var self = universe;

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
      self.tape = Tape.setBlocks(Tape.next(self.daemon), Immutable.List(output))
    },
    println: function (input) {
      self.println(input)
    },
    print: function (input) {
      self.print(input)
    }
  }
}

Universe.accessors = function (universe) {
  var self = universe;

  return {
    handleOrOffsetLocation: function (handleOrOffset) {
      return Tape.getLocationFromHandleOrOffset(self.tape, handleOrOffset, self.daemon);
    },
    valueAtLocation: function (location) { 
      return Tape.getBlock(location);
    },
    callFold: function (fold, input, numOutputs) {
      var tape = Tape.create(fold.getIn(['code', 'tape']).toJS())
      var location = Tape.beginning(tape);

      // Replace blanks with inputs
      tape = Tape.setBlocks(location, input);

      var universe = Universe.create(tape);

      while (universe.alive) { universe.step() }

      // Rewind once from death,
      location = Tape.previous(universe.daemon);
      // // Twice from inserted 'END'
      // location = Tape.previous(location);

      var output = Tape.getBlocks(location, numOutputs * -1)

      return output;
    }
  }
}

Universe.record = function (universe) {
  universe.set('history', universe.get('history').push(Tape.toString(universe.get('tape'))))

  return universe; 
}

Universe.prototype.copy = function () {
  var cpy = Universe.create(this.tape);

  cpy.daemon = this.daemon.set('tape', cpy.tape)
  cpy.stepsTaken = this.stepsTaken;
  cpy.history = this.history.slice();
  cpy.alive = this.alive;
  cpy.log = this.log.slice();

  return cpy;
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

