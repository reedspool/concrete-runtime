var Tape = require('../Tape.js')
var Block = require('../Block.js')

var Universe = require('../Universe.js')
var Immutable = require('immutable');

var BU;

module.exports = BU = {
  /**
   * Constants
   * 
   */
  VARIABLE_OUTPUTS: -1,
  VARIABLE_INPUTS: -1,

  /**
   * Side Effects
   * 
   */
  stepDaemon: function (universe) {
    // Get necessary stuff out
    var daemon = universe.get('daemon');

    var nextLocation = Tape.next(daemon);

    nextLocation = nextLocation.set('tape', universe.get('tape'))

    universe = universe.set('daemon', nextLocation);

    return universe;
  },

  setOutput: function (universe, blocks) {
    var location = Tape.next(universe.get('daemon'))

    location = location.set('tape', universe.get('tape'))

    return BU.setBlocks(universe, location, blocks)
  },
  setBlocks: function (universe, location, blocks) {
    var outputTape = Tape.setBlocks(location, blocks);

    universe = universe.set('tape', outputTape)

    return universe;
  },
  die: function (universe) {
    return universe.set('alive', false)
  }, 
  jump: function (universe, location) {
    return universe.set('daemon', location)
  },
  writeFromTo: function (universe, source, destination) { 
    return universe.set('tape', Tape.setBlock(destination, Tape.getBlock(source)))
  },
  output: function (universe, output) {
    return universe.set('tape', Tape.setBlocks(Tape.next(universe.get('daemon')), Immutable.List(output)))
  },
  println: function (universe, input) {
    return Universe.println(universe, input)
  },
  print: function (universe, input) {
    return Universe.print(universe, input)
  },

  /**
   * Accessors
   * 
   */
  outputToBlocks: function(output) {
    return Immutable.List(output.map(function (d) {
      return Block.fromString( d.toString ? d.toString() : '' + d);
    }))
  },
  getInputs: function (daemon, number) {
    return Tape.getBlocks(daemon, number).map(Block.getValue)
  }, 
  handleOrOffsetLocation: function (universe, handleOrOffsetBlock) {
    return Tape.getLocationFromHandleOrOffset(universe.get('tape'), handleOrOffsetBlock, universe.get('daemon'));
  },
  valueAtLocation: function (location) { 
    return Tape.getBlock(location);
  },
  getBlock: function (location, offset) { 
    return Tape.getBlock(Tape.next(location, offset));
  },
  getBlocks: function (location, offset, count) { 
    return Tape.getBlocks(Tape.next(location, offset), count);
  },
  callFold: function (fold, input, numOutputs, environment) {
    var tape = fold.getIn(['code', 'tape'])

    tape = Tape.cullHandles(tape);
    tape = Tape.halting(tape);

    var location = Tape.beginning(tape);

    // Replace blanks with inputs
    tape = Tape.setBlocks(location, input);

    var childUniverse = Universe.create(tape);

    while (childUniverse.get('alive')) { 
      childUniverse = Universe.step(childUniverse, environment);
    }

    location = childUniverse.get('daemon')

    var output = Tape.getBlocks(location, numOutputs * -1)

    return output;
  },

  inputCount: function (fold) {
    var blocks = fold.getIn(['code', 'tape', 'blocks']);
    var i = 0;
    var length = blocks.size;

    while (Block.matches(blocks.get(i), Block.fromString('_')) 
            && i < length) {
      i++
    }

    return i;
  },

  outputCount: function (fold) {
    var blocks = fold.getIn(['code', 'tape', 'blocks']);
    var i = blocks.size - 1;
    var count = 0;

    while (Block.matches(blocks.get(i), Block.fromString('_')) 
            && i >= 0) {
      i--;
      count++;
    }

    return count;
  }
}