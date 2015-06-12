var Immutable = require('immutable');
var BlockUtilities = require('./BlockUtilities.js')

var PrintBlock = {
  inputs: 1,
  outputs: 0,
  op: '.',
  type: 'operator',
  executable: function (universe) { 
    // Get necessary stuff out
    var daemon = universe.get('daemon');

    var inputs = BlockUtilities.getInputs(daemon, PrintBlock.inputs * -1)

    var location = BlockUtilities.print(inputs.get(0))

    return BlockUtilities.stepDaemon(universe)
  }
}

module.exports = PrintBlock