var _ = require('lodash'),
    assert = require('assert'),
    config = require('./config.js'),
    util = require('./util.js'),
    Tape = require('./Tape.js');

function Universe() {}
var __proto = new Universe();

Universe.make = function (codez) {
  util.log('codez: ' + codez)
  var u = Object.create(__proto);
  var tape = Tape.fromString(codez);

  u.tape = tape;
  u.__original = u;

  // There need be an END token
  if (tape.get(tape.length() -1) != 'END') tape.set(tape.length(), 'END')

  // For now, a daemon is just a location
  u.daemon = 0;

  return u;
}

/**
 * Step the universe exactly once.
 */
Universe.prototype.step = function () {
  var copy = this.copy();
  var t1 = copy.tape;
  var daemon = copy.daemon;

  if (daemon >= t1.length()) {
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


  if (codeInfo.sideEffects) {
    codeInfo.sideEffects({
        end: function () {
          copy.alive = false;
        }
      });
  }

  var outputBegin = daemon + 1;
  
  if (newOutput) {
    copy.tape.spliceArray(outputBegin, newOutput.length, newOutput)
  }

  copy.daemon++;

  return copy;
}

Universe.prototype.copy = function () { 
  var u1 = Object.create(__proto)

  u1.tape = this.tape.copy();
  u1.daemon = this.daemon;
  u1.alive = this.alive;
  u1.__original = this.__original;

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
    END: END
  };

  var info = specifics[opcode]

  if (typeof info == 'function') info = info();

  return _.extend(base, info);
}

module.exports = {
  create: Universe.make
}