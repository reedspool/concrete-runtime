var Immutable = require('immutable');
var BlockUtilities = require('./BlockUtilities.js')

var PrintLineBlock = {
  inputs: 1,
  outputs: 0,
  op: 'print',
  type: 'operator',
  executable: function (universe) { 
    // Get necessary stuff out
    var daemon = universe.get('daemon');

    var inputs = BlockUtilities.getInputs(daemon, PrintLineBlock.inputs * -1)

    
    universe = BlockUtilities.println(universe, inputs.get(0))

    return BlockUtilities.stepDaemon(universe)
  }
}

module.exports = PrintLineBlock