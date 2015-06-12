var Immutable = require('immutable');
var BlockUtilities = require('./BlockUtilities.js')

var SumBlock = {
  inputs: 2,
  outputs: 1,
  op: '+',
  type: 'operator',
  executable: function (universe) { 
    // Get necessary stuff out
    var daemon = universe.get('daemon');

    var inputs = BlockUtilities.getInputs(daemon, SumBlock.inputs * -1)

    var sum = inputs
                .map(function (d) { return parseInt(d, 10); })
                .reduce(function (a, b) { return a + b; }, 0)

    var output = BlockUtilities.outputToBlocks([sum])

    var editedUniverse = BlockUtilities.setOutput(universe, output)

    return BlockUtilities.stepDaemon(editedUniverse)
  }
}

module.exports = SumBlock