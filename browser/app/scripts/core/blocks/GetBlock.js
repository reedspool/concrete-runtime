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
if(true) debugger; /* TESTING - Delete me */
    var inputs = BlockUtilities.getBlocks(daemon, -1, GetBlock.inputs)

    var location = BlockUtilities.handleOrOffsetLocation(universe, inputs.get(0))

    var result = BlockUtilities.getBlock(location, 0);

    var output = Immutable.List([result])

    var editedUniverse = BlockUtilities.setOutput(universe, output)

    return BlockUtilities.stepDaemon(editedUniverse)
  }
}

module.exports = GetBlock