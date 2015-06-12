var Immutable = require('immutable');
var BlockUtilities = require('./BlockUtilities.js')

var GetBlock = {
  inputs: 1,
  outputs: 1,
  op: 'get',
  type: 'operator',
  executable: function (universe) { 
    // Get necessary stuff out
    var daemon = universe.get('daemon');

    var inputs = BlockUtilities.getInputs(daemon, GetBlock.inputs * -1)

    var location = BlockUtilities.handleOrOffsetLocation(inputs.get(0))

    var result = BlockUtilities.valueAtLocation(location);

    var output = BlockUtilities.outputToBlocks([result])

    var editedUniverse = BlockUtilities.setOutput(universe, output)

    return BlockUtilities.stepDaemon(editedUniverse)
  }
}

module.exports = GetBlock