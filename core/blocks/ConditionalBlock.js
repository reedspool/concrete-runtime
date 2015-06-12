var Immutable = require('immutable');
var BlockUtilities = require('./BlockUtilities.js')

var ConditionalBlock = {
  inputs: 3,
  outputs: 1,
  op: '?',
  type: 'operator',
  executable: function (universe) { 
    // Get necessary stuff out
    var daemon = universe.get('daemon');

    var inputs = BlockUtilities.getInputs(daemon, ConditionalBlock.inputs * -1)

    var predicate = inputs.get(0);
    var yes = inputs.get(1);
    var no = inputs.get(2);
    
    var result = predicate ? yes : no

    var output = BlockUtilities.outputToBlocks([result])

    var editedUniverse = BlockUtilities.setOutput(universe, output)

    return BlockUtilities.stepDaemon(editedUniverse)
  }
}

module.exports = ConditionalBlock