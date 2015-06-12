var _ = require('lodash'),
    config = require('./config.js'),
    util = require('./util.js'),
    Immutable = require('immutable'),
    Parser = require('./ConcreteParser.js');

module.exports = Block

function Block() {}


Block.fromString = function(original) {
  var tape = Parser.parse(original);

  return Immutable.fromJS(tape.blocks[0]);
}

// Cheating
Block.fromNumber = function(original) { return Block.fromString('' + original) }
Block.fromBoolean = function(original) { return Block.fromString('' + original) }

Block.toString = function(block) {
  var str;
  var code = block.get('code')

  switch(Block.getType(block)) {
    case "literal":
      str = code;
      break;
    case "fold": 
    if(true) debugger; /* TESTING - Delete me */
      str = "[" + code.get('tape').get('original') + "]"
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

Block.getType = function (block) {
  var code = block.get('code')

  return typeof code == 'string'
        ? 'literal'
        : code.get('type')

}

Block.getValue = function(block) {
  var value;

  var code = block.get('code')

  switch(Block.getType(block)) {
    case "literal":
      value = code;
      break;
    case "fold": 
      value = code.getIn(['tape', 'blocks'])
      break;
    case "number": 
      value = Number(code.get('value'))
      break;
    case "operator":
      false
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
  return Block.getValue(a) == Block.getValue(b)
}

Block.opCode = function (block) {

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
    op: function () {}
  };

  var END = {
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
          sides.output(Immutable.List([parseInt(inputs.get(0), 10) + parseInt(inputs.get(1), 10)].map(Block.fromNumber)))
        }
    },
    '-': {
      inputs: 2,
      out: 1,
      op: function (inputs, sides) { 
          sides.output(Immutable.List([parseInt(inputs.get(0), 10) - parseInt(inputs.get(1), 10)].map(Block.fromNumber)))
        }
    },
    '*': {
      inputs: 2,
      out: 1,
      op: function (inputs, sides) { 
          sides.output(Immutable.List([parseInt(inputs.get(0), 10) * parseInt(inputs.get(1), 10)].map(Block.fromNumber)))
        }
    },
    '/': {
      inputs: 2,
      out: 1,
      op: function (inputs, sides) { 
          sides.output(Immutable.List([parseInt(inputs.get(0), 10) / parseInt(inputs.get(1), 10)].map(Block.fromNumber)))
        }
    },
    '>': {
      inputs: 2,
      out: 1,
      op: function (inputs, sides) { 
          var result = parseInt(inputs.get(0), 10) > parseInt(inputs.get(1), 10);

          sides.output(Immutable.List([(result ? '"Greater Than"' : '!"Not Greater Than"') ].map(Block.fromString)))
        }
    },
    '<': {
      inputs: 2,
      out: 1,
      op: function (inputs, sides) { 
          var result = parseInt(inputs.get(0), 10) < parseInt(inputs.get(1), 10);

          sides.output(Immutable.List([(result ? '"Less Than"' : '!"Not Less Than"') ].map(Block.fromString)))
        }
    },
    '?': {
      inputs: 3,
      out: 1,
      op: function (inputs, sides) { 
          var predicate = inputs.get(0);
          var yes = inputs.get(1);
          var no = inputs.get(2);

          sides.output(Immutable.List([ '' + (predicate ? yes : no) ].map(Block.fromString)))
        }
    },
    'call': function (environment) {
      var fold = environment.left.last();

      return {
        inputs: __inputCount(fold) + 1,
        out: __outputCount(fold),
        op: function (inputs, sides) { 
            // Chop off the actual fold;
            inputs = inputs.pop();

            // Turn them back into blocks
            inputs = inputs.map(function (a) { return a + ''; }).map(Block.fromString);

            // Call it
            var output = sides.callFold(fold, inputs, __outputCount(fold))

            sides.output(output)
          }
      }
    },
    'times': function (environment) {
      var fold = environment.left.get(environment.left.size - 2);

      return {
        inputs: __inputCount(fold) + 1 + 1,
        out: __outputCount(fold),
        op: function (inputs, sides) {
            // Get the number, and remove it
            var num = inputs.last();
            inputs = inputs.pop();

            // Chop off the actual fold;
            inputs = inputs.pop();

            // Call it
            while (num > 0) {
              var output = sides.callFold(fold, inputs, __outputCount(fold))
              num--;
            }

            sides.output(output)
          }
      }
    },
    'reduce': function (environment) {
      var fold = environment.left.get(environment.left.size - 2);

      return {
        inputs: 3,
        out: 1,
        op: function (inputs, sides) {
            // Get the initial, and remove it
            var initial = inputs.last();
            var next;
            var memo;

            inputs = inputs.pop();

            // Chop off the actual fold;
            inputs = inputs.pop();

            // Get the list to act on
            var list = inputs.get(0)

            // set actual inputs

            // Call it
            var length = list.size;
            var i = 0;
            while (i < length) {

              next = list.get(i)
              memo = output
                ? output.get(0) 
                : Block.fromString(initial + '')
              inputs = Immutable.List([next, memo])

              var output = sides.callFold(fold, inputs, __outputCount(fold))

              // Reset inputs 
              i++;
            }

            sides.output(output)
          }
      }
    },
    'jump': {
      inputs: 1,
      out: 0,
      op: function (inputs, sides) { 
        sides.jump(sides.handleOrOffsetLocation(inputs.get(0)))
      }
    },
    'move': {
      inputs: 2,
      out: 0,
      op: function (inputs, sides) { 
        sides.writeFromTo(sides.handleOrOffsetLocation(inputs.get(0)), sides.handleOrOffsetLocation(inputs.get(1)))
      }
    },
    'get': {
      inputs: 1,
      out: 1,
      op: function (inputs, sides) { 
        sides.output([sides.valueAtLocation(sides.handleOrOffsetLocation(inputs.get(0)))])
      }
    },
    'print': {
      inputs: 1,
      out: 0,
      op: function (inputs, sides) { 
        sides.println(inputs.get(0))
      }
    },
    '.': {
      inputs: 1,
      out: 0,
      op: function (inputs, sides) { 
        if(true) debugger; /* TESTING - Delete me */
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