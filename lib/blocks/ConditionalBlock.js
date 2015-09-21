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
    var blockInputs = BlockUtilities.getBlocks(daemon, -3, 3)
    var predicate = inputs.get(0);
    var no = blockInputs.get(2);
    var yes = blockInputs.get(1);
    if(true) debugger; /* TESTING - Delete me */
    var result = predicate ? yes : no

    var output = Immutable.List([result])

    var editedUniverse = BlockUtilities.setOutput(universe, output)

    return BlockUtilities.stepDaemon(editedUniverse)
  }
}

module.exports = ConditionalBlock