var BlockUtilities = require('./BlockUtilities.js')

var NumberBlock = {
  inputs: 0,
  outputs: 0,
  op: 'number',
  type: 'number',
  executable: BlockUtilities.stepDaemon
}

module.exports = NumberBlock