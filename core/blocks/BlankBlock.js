var BlockUtilities = require('./BlockUtilities.js')

var BlankBlock = {
  inputs: 0,
  outputs: 0,
  op: '_',
  type: 'noop',
  executable: BlockUtilities.stepDaemon
}

module.exports = BlankBlock