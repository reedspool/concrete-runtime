var BlockUtilities = require('./BlockUtilities.js')

var FoldBlock = {
  inputs: 0,
  outputs: 0,
  op: 'fold',
  type: 'fold',
  executable: BlockUtilities.stepDaemon
}

module.exports = FoldBlock