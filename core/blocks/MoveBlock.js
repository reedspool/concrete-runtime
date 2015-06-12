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

    var inputs = BlockUtilities.getInputs(daemon, MoveBlock.inputs * -1)

    var source = BlockUtilities.handleOrOffsetLocation(inputs.get(0));
    var dest = BlockUtilities.handleOrOffsetLocation(inputs.get(1))

    var editedUniverse = BlockUtilities.writeFromTo(source, dest)

    return BlockUtilities.stepDaemon(editedUniverse)
  }
}

module.exports = MoveBlock