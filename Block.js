var _ = require('lodash'),
    assert = require('assert'),
    config = require('./config.js'),
    util = require('./util.js');

function Block() {}

module.exports = Block

var __proto = new Block();

Block.create = function (word) {
  var block = Object.create(__proto);

  block.__value = word;
  block.info = getCodeInfo(word);

  return block;
}

Block.fromString = function (word) {
  word.replace(/[#].*/g, '')
  return Block.create(word);
}

Block.fromNumber = function (num) {
  var block = Block.fromString(num + '')

  block.__value = num;

  return block;
}

Block.fromBoolean = function (bool) {
  var block = Block.fromString(bool + '')

  block.__value = bool;

  return block;
}

Block.prototype.getValue = function() {
  return this.__value;
};

Block.prototype.toString = function() {
  return this.__value.toString();
};

Block.prototype.matches = function(word) {
  return this.toString() === word;
};

Block.prototype.copy = function() {
  // Cheapo implementation.
  return Block.fromString(this.toString())
};

function getCodeInfo(word) {
  var opcode = word;

  if (word.match(config.VALUE_REGEX)) opcode = 'value';

  var base = {
    inputs: 0,
    out: 0,
    sideEffects: false,
    op: function () {}
  };

  var END = {
    sideEffects: true,
    op: function (input, sides) { sides.end(); }
  }
  
  /**
   * Super shitty registry for now. create this dynamic so we can have modules
   */
  var specifics = {
    noop: base,
    value: base,
    '_': base,

    '+': {
      inputs: 2,
      out: 1,
      op: function (inputs, output) { 
          output([parseInt(inputs[0].getValue(), 10) + parseInt(inputs[1].getValue(), 10)].map(Block.fromNumber))
        }
    },
    '-': {
      inputs: 2,
      out: 1,
      op: function (inputs, output) { 
          output([parseInt(inputs[0].getValue(), 10) - parseInt(inputs[1].getValue(), 10)].map(Block.fromNumber))
        }
    },
    '*': {
      inputs: 2,
      out: 1,
      op: function (inputs, output) { 
          output([parseInt(inputs[0].getValue(), 10) * parseInt(inputs[1].getValue(), 10)].map(Block.fromNumber))
        }
    },
    '/': {
      inputs: 2,
      out: 1,
      op: function (inputs, output) { 
          output([parseInt(inputs[0].getValue(), 10) / parseInt(inputs[1].getValue(), 10)].map(Block.fromNumber))
        }
    },
    '>': {
      inputs: 2,
      out: 1,
      op: function (inputs, output) { 
          var result = parseInt(inputs[0].getValue(), 10) > parseInt(inputs[1].getValue(), 10);

          output([result ? true : false ].map(Block.fromBoolean))
        }
    },
    '<': {
      inputs: 2,
      out: 1,
      op: function (inputs, output) { 
          var result = parseInt(inputs[0].getValue(), 10) < parseInt(inputs[1].getValue(), 10);

          output([result ? true : false ].map(Block.fromBoolean))
        }
    },
    '?': {
      inputs: 3,
      out: 1,
      op: function (inputs, output) { 
          var predicate = util.parseBoolean(inputs[0].getValue())
          var yes = inputs[1].getValue();
          var no = inputs[2].getValue();

          output([ predicate ? yes : no ].map(Block.fromString))
        }
    },
    'jump': {
      inputs: 1,
      out: 0,
      sideEffects: true,
      op: function (inputs, sides) { 
        sides.jump(parseInt(inputs[0].getValue()))
      }
    },
    'slide': {
      inputs: 1,
      out: 0,
      sideEffects: true,
      op: function (inputs, sides) { 
        sides.slide(parseInt(inputs[0].getValue()))
      }
    },
    'copy': {
      inputs: 2,
      out: 0,
      sideEffects: true,
      op: function (inputs, sides) { 
        sides.writeFromTo(parseInt(inputs[0].getValue()), parseInt(inputs[1].getValue()))
      }
    },
    'move': {
      inputs: 2,
      out: 0,
      sideEffects: true,
      op: function (inputs, sides) { 
        sides.writeFromTo(sides.handleAddress(inputs[0].getValue()), sides.handleAddress(inputs[1].getValue()))
      }
    },
    'get': {
      inputs: 1,
      out: 1,
      sideEffects: true,
      op: function (inputs, sides) { 
        sides.output([sides.valueAtHandle(inputs[0].getValue()).copy()])
      }
    },
    'print': {
      inputs: 1,
      out: 0,
      sideEffects: true,
      op: function (inputs, sides) { 
        sides.println(inputs[0].getValue())
      }
    },
    '.': {
      inputs: 1,
      out: 0,
      sideEffects: true,
      op: function (inputs, sides) { 
        sides.print(inputs[0].getValue())
      }
    },
    END: END
  };

  var info = specifics[opcode]

  if (typeof info == 'function') info = info();

  return _.extend(base, info);
}