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
    case "valueReference":
      str = '*' + code.get('value')
  }

  return str + '';
}

Block.getType = function (block) {
  var code = block.get('code')

  return typeof code == 'string'
        ? 'literal'
        : code.get('type')

}

Block.isBlank = function (block) {
  return block.get('code') == '_'
}

Block.isEnd = function (block) {
  return block.get('code') == 'END'
}

Block.getValue = function(block, tape) {
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
      value = ! !!(Block.getValue(code.get('value'), tape))
      break;
    case "valueReference": // VALUE REFERENCES NEED TO KNOW ABOUT THE WORLD!
      value = Block.getValueReference(code.get('value'), tape);
      break;
  }

  return value;
}

Block.getValueReference = function (handle, tape) {
  // Go through handles to find the reference, get that block's value
  var index = tape.get('__handles')[handle];
  
  if ( ! index ) throw new Error('Undefined value reference ' + handle);

  if ( !  tape.getIn(['blocks', index]) ) throw new Error('Value reference out of bounds: ' + index)

  return Block.getValue(tape.getIn(['blocks', index]), tape);
}

Block.matches = function(a, b) {
  return Block.getValue(a) == Block.getValue(b)
}

Block.opCode = function (block) {
  if(!block) debugger; /* TESTING - Delete me */
  
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
  };

  var info = specifics[opcode];

  return typeof info == 'function'
    ? info
    : _.extend(base, info);
}