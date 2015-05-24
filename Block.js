var _ = require('lodash'),
    config = require('./config.js'),
    util = require('./util.js'),
    Address = require('./Address.js');

function Block() {}

module.exports = Block

var __proto = new Block();

function Code() {};

var __proto = new Code();

Block.toString = function(block) {
  var str;
  var code = block.code;

  switch(code.type) {
    case undefined:  // Literal
      str = code;
      break;
    case "fold": 
      str = code.tape.blocks
            .map(Block.toString)
            .join(' ')
      break;
    case "number": 
      str = code.value
      break;
    case "operator":
      str = code.op
      break;
    case "address":
      str = '@' + code.value
      break;
    case "string":
      str = '"' + code.value + '"'
      break;
    case "falsey":
      str = '!' + Block.toString(code.value)
      break;
  }

  return str;
}

Block.getInfo = function (block) {
  return getCodeInfo(block.code.type)
}

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