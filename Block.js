var _ = require('lodash'),
    config = require('./config.js'),
    util = require('./util.js'),
    Immutable = require('immutable'),
    Parser = require('./ConcreteParser.js');

function Block() {}

module.exports = Block

var __proto = new Block();

function Code() {};

var __proto = new Code();

Block.fromString = function(original) {
  var tape = Parser.parse(original);

  return Immutable.fromJS(tape.blocks[0]);
}

Block.fromNumber = function(original) { return Block.fromString('' + original) }
Block.fromBoolean = function(original) { return Block.fromString('' + original) }

Block.toString = function(block) {
  var str;
  var code = block.get('code');

  if ( ! code.get || ! code.get('type') ) {
    // Literal
    return code;
  }

  switch(code.get('type')) {
    case "fold": 
      str = "[ " + code.getIn(['tape', 'blocks'])
            .map(Block.toString)
            .join(' ') + " ]"
      break;
    case "number": 
      str = code.get('value')
      break;
    case "operator":
      str = code.get('op')
      break;
    case "address":
      str = '@' + code.get('value')
      break;
    case "string":
      str = '"' + code.get('value') + '"'
      break;
    case "falsey":
      str = '!' + Block.toString(code.get('value'))
      break;
  }

  return str + '';
}

Block.getValue = function(block) {
  var value;
  var code = block.get('code');

  if ( ! code.get || ! code.get('type') ) {
    // Literal
    return code;
  }

  switch(code.get('type')) {
    case "fold": 
      value = code.getIn(['tape', 'blocks'])
      break;
    case "number": 
      value = Number(code.get('value'))
      break;
    case "operator":
      throw new Error('Operator' + code.get('op') + 'can\'t be evaluated')
      break;
    case "address":
      value = code.get('value')
      break;
    case "string":
      value = code.get('value')
      break;
    case "falsey":
      value = ! !!(Block.getValue(code.get('value')))
      break;
  }

  return value;
}

Block.matches = function(a, b) {
  return Block.toString(a) == Block.toString(b)
}

Block.getInfo = function (block) {
  return __getCodeInfo(__opcode(block));
}

function __opcode(block) {
  if ( ! block.get('code').get || ! block.get('code').get('type')) {
    // Literal
    return block.get('code');
  }

  if ( block.get('code').get('type') == 'operator') {
    return block.get('code').get('op')
  }

  return block.get('code').get('type');

}

function __getCodeInfo(opcode) {

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
    number: base,
    address: base,
    '_': base,

    '+': {
      inputs: 2,
      out: 1,
      op: function (inputs, sides) { 
          sides.output([parseInt(inputs.get(0), 10) + parseInt(inputs.get(1), 10)].map(Block.fromNumber))
        }
    },
    '-': {
      inputs: 2,
      out: 1,
      op: function (inputs, sides) { 
          sides.output([parseInt(inputs.get(0), 10) - parseInt(inputs.get(1), 10)].map(Block.fromNumber))
        }
    },
    '*': {
      inputs: 2,
      out: 1,
      op: function (inputs, sides) { 
          sides.output([parseInt(inputs.get(0), 10) * parseInt(inputs.get(1), 10)].map(Block.fromNumber))
        }
    },
    '/': {
      inputs: 2,
      out: 1,
      op: function (inputs, sides) { 
          sides.output([parseInt(inputs.get(0), 10) / parseInt(inputs.get(1), 10)].map(Block.fromNumber))
        }
    },
    '>': {
      inputs: 2,
      out: 1,
      op: function (inputs, sides) { 
          var result = parseInt(inputs.get(0), 10) > parseInt(inputs.get(1), 10);

          sides.output([(result ? '"Greater Than"' : '!"Not Greater Than"') ].map(Block.fromString))
        }
    },
    '<': {
      inputs: 2,
      out: 1,
      op: function (inputs, sides) { 
          var result = parseInt(inputs.get(0), 10) < parseInt(inputs.get(1), 10);

          sides.output([(result ? '"Less Than"' : '!"Not Less Than"') ].map(Block.fromString))
        }
    },
    '?': {
      inputs: 3,
      out: 1,
      op: function (inputs, sides) { 
          var predicate = util.parseBoolean(inputs.get(0))
          var yes = inputs.get(1);
          var no = inputs.get(2);

          sides.output([ '' + (predicate ? yes : no) ].map(Block.fromString))
        }
    },
    'call': {
        inputs: 3,
        out: 1,
        op: function (inputs, sides) { 
            var predicate = util.parseBoolean(inputs.get(0))
            var yes = inputs.get(1);
            var no = inputs.get(2);

            sides.output([ '' + (predicate ? yes : no) ].map(Block.fromString))
          }
      },
    'jump': {
      inputs: 1,
      out: 0,
      sideEffects: true,
      op: function (inputs, sides) { 
        sides.jump(sides.handleOrOffsetLocation(inputs.get(0)))
      }
    },
    'move': {
      inputs: 2,
      out: 0,
      sideEffects: true,
      op: function (inputs, sides) { 
        sides.writeFromTo(sides.handleOrOffsetLocation(inputs.get(0)), sides.handleOrOffsetLocation(inputs.get(1)))
      }
    },
    'get': {
      inputs: 1,
      out: 1,
      sideEffects: true,
      op: function (inputs, sides) { 
        sides.output([sides.valueAtLocation(sides.handleOrOffsetLocation(inputs.get(0)))])
      }
    },
    'print': {
      inputs: 1,
      out: 0,
      sideEffects: true,
      op: function (inputs, sides) { 
        sides.println(inputs.get(0))
      }
    },
    '.': {
      inputs: 1,
      out: 0,
      sideEffects: true,
      op: function (inputs, sides) { 
        sides.print(inputs.get(0))
      }
    },
    END: END
  };

  var info = specifics[opcode];

  return typeof info == 'function'
    ? info
    : _.extend(base, info);
}