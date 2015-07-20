var BlockUtilities = require('./BlockUtilities.js')

var EndBlock = {
  inputs: 0,
  outputs: 0,
  op: 'END',
  type: 'die',
  executable: BlockUtilities.die
}

module.exports = EndBlock