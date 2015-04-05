var _ = require('lodash'),
    assert = require('assert'),
    config = require('./config.js'),
    util = require('./util.js');

function Block() {}
module.exports = Block
var __proto = new Block();

Block.create = function (code) {
  var block = Object.create(__proto);

  block.__value = code;
  block.info = getCodeInfo(code);

  return block;
}

Block.prototype.getValue = function() {
  return this.__value;
};

Block.prototype.toString = function() {
  return this.__value.toString();
};


function getCodeInfo(code) {
  var opcode = code;
  var base = {
    inputs: 0,
    out: 0,
    sideEffects: false,
    op: function () {}
  };

  var END = {
    sideEffects: function (sides) { sides.end(); }
  }

  if (code.toString().match(config.VALUE_REGEX)) opcode = 'value';
  
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
          output([parseInt(inputs[0].getValue(), 10) + parseInt(inputs[1].getValue(), 10)].map(Block.create))
        }
    },
    '>': {
      inputs: 2,
      out: 1,
      op: function (inputs, output) { 
          var result = parseInt(inputs[0].getValue(), 10) > parseInt(inputs[1].getValue(), 10);

          output([result ? true : false ].map(Block.create))
        }
    },
    '?': {
      inputs: 3,
      out: 1,
      op: function (inputs, output) { 
          var predicate = Boolean(inputs[0].getValue())
          var yes = inputs[1].getValue();
          var no = inputs[2].getValue();

          output([ predicate ? yes : no ].map(Block.create))
        }
    },
    'goto': {
      inputs: 1,
      out: 0,
      sideEffects: true,
      op: function (inputs, sides) { 
        sides.goto(parseInt(inputs[0].getValue()))
      }
    },
    'shift': {
      inputs: 1,
      out: 0,
      sideEffects: true,
      op: function (inputs, sides) { 
        sides.shift(parseInt(inputs[0].getValue()))
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
    END: END
  };

  var info = specifics[opcode]

  if (typeof info == 'function') info = info();

  return _.extend(base, info);
}