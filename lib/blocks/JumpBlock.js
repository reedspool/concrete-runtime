var Immutable = require('immutable');
var BlockUtilities = require('./BlockUtilities.js')

var JumpBlock = {
  inputs: 1,
  outputs: 0,
  op: 'jump',
  type: 'operator',
  executable: function (universe) { 
    // Get necessary stuff out
    var daemon = universe.get('daemon');

    var handleOrOffset = BlockUtilities.getBlock(daemon, -1)

    var location = BlockUtilities.handleOrOffsetLocation(universe, handleOrOffset)

    return universe.set('daemon', location)
  }
}

module.exports = JumpBlock