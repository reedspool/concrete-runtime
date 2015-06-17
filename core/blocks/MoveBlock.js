var Immutable = require('immutable');
var BlockUtilities = require('./BlockUtilities.js')

var MoveBlock = {
  inputs: 2,
  outputs: 0,
  op: 'move',
  type: 'operator',
  executable: function (universe) { 
    // Get necessary stuff out
    var daemon = universe.get('daemon');

    var inputs = BlockUtilities.getBlocks(daemon, -2, MoveBlock.inputs)

    var source = BlockUtilities.handleOrOffsetLocation(universe, inputs.get(0));
    var dest = BlockUtilities.handleOrOffsetLocation(universe, inputs.get(1))

    var editedUniverse = BlockUtilities.writeFromTo(universe, source, dest)

    return BlockUtilities.stepDaemon(editedUniverse)
  }
}

module.exports = MoveBlock