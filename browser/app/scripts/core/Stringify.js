var Block = require('./Block.js');

module.exports {
  StringifyTape: function (tape) { 
    var self = tape;

    var handlePositions = [];

    self.get('__handles').forEach(function (key, val) { 
      handlePositions[key] = val;
    })

    return self.get('blocks')
      .map(function (block) { return Block.toString(block) })
      .map(function (block, i) { return handlePositions[i] 
                                        ? block + '#' + handlePositions[i] 
                                        : block; })
      .join(' ')
  }
}