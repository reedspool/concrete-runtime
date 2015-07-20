var Immutable = require('immutable');
var BlockUtilities = require('./BlockUtilities.js')

var CallBlock = {
  inputs: BlockUtilities.VARIABLE_INPUTS,
  outputs: BlockUtilities.VARIABLE_OUTPUTS,
  op: 'call',
  type: 'operator',
  executable: function (universe, environment) { 
    // Get necessary stuff out
    var daemon = universe.get('daemon');

    var fold = BlockUtilities.getBlock(daemon, -1)

    var inputCount = BlockUtilities.inputCount(fold);
    var outputCount = BlockUtilities.outputCount(fold);

    var inputs = BlockUtilities.getBlocks(daemon, -1, inputCount * -1)

    var output = BlockUtilities.callFold(fold, inputs, outputCount, environment)

    var editedUniverse = BlockUtilities.setOutput(universe, output)

    return BlockUtilities.stepDaemon(editedUniverse)
  }
}

module.exports = CallBlock