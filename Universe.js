var _ = require('lodash'),
    assert = require('assert'),
    config = require('./config.js'),
    util = require('./util.js'),
    Tape = require('./Tape.js');

function Universe() {}
var __proto = new Universe();

Universe.make = function (codez) {
  var u = Object.create(__proto);
  var tape = Tape.fromString(codez);

  u.tape = tape;
  u.__original = u;

  // For now, a daemon is just a location
  u.daemon = 0;

  return u;
}

/**
 * Step the universe exactly once.
 */

Universe.prototype.stepsTaken = 0;

Universe.prototype.step = function () {
  this.stepsTaken++;

  var copy = this.copy();
  var t1 = copy.tape;
  var daemon = copy.daemon;

  if (daemon >= t1.length() ||
    this.stepsTaken >= config.MAX_UNIVERSE_STEPS) {
    copy.alive = false;
    return copy;
  };

  // Get code at location
  var code = t1.get(daemon).toString();

  var codeInfo = getCodeInfo(code)

  assert(codeInfo, 'Bad codez: ' + codeInfo + ' @ ' + daemon);

  var inputBegin = daemon - codeInfo.inputs;
  var inputEnd = daemon
  var inputs = t1.get(inputBegin, inputEnd - inputBegin);

  var newOutput = codeInfo.op(inputs);



  var outputBegin = daemon + 1;

  if (newOutput) {
    copy.tape.spliceArray(outputBegin, newOutput.length, newOutput)
  }

  copy.daemon++;

  if (codeInfo.sideEffects) {
    codeInfo.sideEffects({
        end: function () {
          copy.alive = false;
        }, 
        goto: function (offset) { 
          copy.daemon = offset;
        }, 
        writeFromTo: function (from, to) { 
          t1.set(to, t1.get(from))
        }
      }, inputs);
  }

  return copy;
}

Universe.prototype.copy = function () { 
  var u1 = Object.create(__proto)

  u1.tape = this.tape.copy();
  u1.daemon = this.daemon;
  u1.alive = this.alive;
  u1.__original = this.__original;
  u1.stepsTaken = this.stepsTaken;

  return u1;
}

Universe.prototype.alive = true;

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

  if (code.match(config.VALUE_REGEX)) opcode = 'value';
  
  /**
   * Super shitty registry for now. Make this dynamic so we can have modules
   */
  var specifics = {
    noop: base,
    value: base,
    '_': base,

    '+': {
      inputs: 2,
      out: 1,
      op: function (inputs) { 
          return [parseInt(inputs[0], 10) + parseInt(inputs[1], 10)]
        }
    },
    '>': {
      inputs: 2,
      out: 1,
      op: function (inputs) { 
          var result = parseInt(inputs[0], 10) > parseInt(inputs[1], 10);

          return [result ? 'true' : 'false']
        }
    },
    '?': {
      inputs: 3,
      out: 1,
      op: function (inputs) { 
          var predicate = Boolean(inputs[0])
          var yes = inputs[1];
          var no = inputs[2];

          return [ predicate ? yes : no ]
        }
    },
    'goto': {
      inputs: 1,
      out: 0,
      sideEffects: function (sides, inputs) { sides.goto(parseInt(inputs[0])) }
    },
    'copy': {
      inputs: 2,
      out: 0,
      sideEffects: function (sides, inputs) { sides.writeFromTo(parseInt(inputs[0]), parseInt(inputs[1])) }
    },
    END: END
  };

  var info = specifics[opcode]

  if (typeof info == 'function') info = info();

  return _.extend(base, info);
}

module.exports = {
  create: Universe.make
}