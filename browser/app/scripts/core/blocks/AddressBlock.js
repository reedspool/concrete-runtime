var BlockUtilities = require('./BlockUtilities.js')

var AddressBlock = {
  inputs: 0,
  outputs: 0,
  op: 'address',
  type: 'address',
  executable: BlockUtilities.stepDaemon
}

module.exports = AddressBlock