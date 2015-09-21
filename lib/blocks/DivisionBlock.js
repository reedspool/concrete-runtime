var Immutable = require('immutable');
var BlockUtilities = require('./BlockUtilities.js')

var DivisionBlock = {
  inputs: 2,
  outputs: 1,
  op: '/',
  type: 'operator',
  executable: function (universe) { 
    // Get necessary stuff out
    var daemon = universe.get('daemon');

    var inputs = BlockUtilities.getInputs(daemon, DivisionBlock.inputs * -1)
                .map(function (d) { return parseInt(d, 10); })

    var a = inputs.get(0)
    var b = inputs.get(1)

    var difference = a / b;

    var output = BlockUtilities.outputToBlocks([difference])

    var editedUniverse = BlockUtilities.setOutput(universe, output)

    return BlockUtilities.stepDaemon(editedUniverse)
  }
}

module.exports = DivisionBlock