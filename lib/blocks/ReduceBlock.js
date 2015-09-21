var Immutable = require('immutable');
var BlockUtilities = require('./BlockUtilities.js')

var ReduceBlock = {
  inputs: BlockUtilities.VARIABLE_INPUTS,
  outputs: BlockUtilities.VARIABLE_OUTPUTS,
  op: 'reduce',
  type: 'operator',
  executable: function (universe, environment) { 
    // Get necessary stuff out
    var daemon = universe.get('daemon');

    var list = BlockUtilities.getBlock(daemon, -3).getIn(['code', 'tape', 'blocks'])
    var fold = BlockUtilities.getBlock(daemon, -2);
    var initial = BlockUtilities.getBlock(daemon, -1);

    var inputCount = BlockUtilities.inputCount(fold);
    var outputCount = BlockUtilities.outputCount(fold);

    var inputs = BlockUtilities.getBlocks(daemon, -3, inputCount * -1)

    var next;
    var memo;

    var length = list.size;
    var i = 0;
    while (i < length) {

      next = list.get(i)
      memo = output
        ? output.get(0) 
        : initial;
      inputs = Immutable.List([next, memo])

      var output = BlockUtilities.callFold(fold, inputs, outputCount, environment)

      // Reset inputs 
      i++;
    }

    var editedUniverse = BlockUtilities.setOutput(universe, output)

    return BlockUtilities.stepDaemon(editedUniverse)
  }
}

module.exports = ReduceBlock