var Immutable = require('immutable');
var BlockUtilities = require('./BlockUtilities.js')

var TimesBlock = {
  inputs: BlockUtilities.VARIABLE_INPUTS,
  outputs: BlockUtilities.VARIABLE_OUTPUTS,
  op: 'times',
  type: 'operator',
  executable: function (universe, environment) { 
    // Get necessary stuff out
    var daemon = universe.get('daemon');

    var num = BlockUtilities.getInputs(daemon, - 1)
    var fold = BlockUtilities.getBlock(daemon, - 2);

    var inputCount = BlockUtilities.inputCount(fold);
    var outputCount = BlockUtilities.outputCount(fold);

    var inputs = BlockUtilities.getBlocks(daemon, -2, inputCount * -1)

    while (num-- > 0) {
      var output = BlockUtilities.callFold(fold, inputs, outputCount, environment)
    }

    var editedUniverse = BlockUtilities.setOutput(universe, output)

    return BlockUtilities.stepDaemon(editedUniverse)
  }
}

module.exports = TimesBlock