var Immutable = require('immutable');
var BlockUtilities = require('./BlockUtilities.js')

var GreaterThanBlock = {
  inputs: 2,
  outputs: 1,
  op: '>',
  type: 'operator',
  executable: function (universe) { 
    // Get necessary stuff out
    var daemon = universe.get('daemon');

    var inputs = BlockUtilities.getInputs(daemon, GreaterThanBlock.inputs * -1)

    var gt = parseInt(inputs.get(0), 10) > parseInt(inputs.get(1), 10);
    
    var result = gt ? '"Greater Than"' : '!"Not Greater Than"'

    var output = BlockUtilities.outputToBlocks([result])

    var editedUniverse = BlockUtilities.setOutput(universe, output)

    return BlockUtilities.stepDaemon(editedUniverse)
  }
}

module.exports = GreaterThanBlock