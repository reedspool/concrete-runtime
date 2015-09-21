var BlockUtilities = require('./BlockUtilities.js')

var StringBlock = {
  inputs: 0,
  outputs: 0,
  op: 'string',
  type: 'string',
  executable: BlockUtilities.stepDaemon
}

module.exports = StringBlock