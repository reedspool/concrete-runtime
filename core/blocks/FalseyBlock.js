var BlockUtilities = require('./BlockUtilities.js')

var FalseyBlock = {
  inputs: 0,
  outputs: 0,
  op: 'falsey',
  type: 'falsey',
  executable: BlockUtilities.stepDaemon
}

module.exports = FalseyBlock