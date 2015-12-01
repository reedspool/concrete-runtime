var BlockUtilities = require('./BlockUtilities.js')

var ValueReferenceBlock = {
  inputs: 0,
  outputs: 0,
  op: 'valueReference',
  type: 'valueReference',
  executable: BlockUtilities.stepDaemon
}

module.exports = ValueReferenceBlock