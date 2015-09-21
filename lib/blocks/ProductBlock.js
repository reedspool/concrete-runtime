var Immutable = require('immutable');
var BlockUtilities = require('./BlockUtilities.js')

var ProductBlock = {
  inputs: 2,
  outputs: 1,
  op: '*',
  type: 'operator',
  executable: function (universe) { 
    // Get necessary stuff out
    var daemon = universe.get('daemon');

    var inputs = BlockUtilities.getInputs(daemon, ProductBlock.inputs * -1)

    var result = inputs
                .map(function (d) { return parseInt(d, 10); })
                .reduce(function (a, b) { return a * b; }, 1)

    var output = BlockUtilities.outputToBlocks([result])

    var editedUniverse = BlockUtilities.setOutput(universe, output)

    return BlockUtilities.stepDaemon(editedUniverse)
  }
}

module.exports = ProductBlock