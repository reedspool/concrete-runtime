var _ = require('lodash'),
    assert = require('assert'),
    config = require('./config.js'),
    util = require('./util.js');

function makeUniverse(tape) { 
  var u = Object.create(myUni);

  u.tape = tape;

  // For now, a daemon is just a location
  u.daemon = 0;

  return u;
}

function Universe() {}
var myUni = new Universe();
var SIDES =
/**
 * Step the universe exactly once.
 */
Universe.prototype.step = function () {
  var copy = this.copy();
  var t1 = copy.tape.slice();
  var d = copy.daemon;

  if (d >= t1.length) {
    copy.alive = false;
    return copy;
  };

  // Get code at location
  var code = t1[d].toString();

  var codeInfo = getCodeInfo(code)

  assert(codeInfo, 'Bad codez: ' + codeInfo + ' @ ' + d);

  var inputBegin = d - codeInfo.inputs;
  var inputEnd = d;
  var inputs = t1.slice(inputBegin, inputEnd);

  var newOutput = codeInfo.op(inputs);


  if (codeInfo.sideEffects) {
    codeInfo.sideEffects({
        end: function () {
          copy.alive = false;
        }
      });
  }

  var outputBegin = d + 1;
  var outputEnd = outputBegin + codeInfo.out
  var outputs = t1.slice(outputBegin, outputEnd);

  var before = t1.slice(0, outputBegin);
  var after = t1.slice(outputEnd);
  console.log('outputs:', outputs)
  console.log('inputs:', inputs)
  var result = [before, newOutput || outputs, after].reduce(util.concat, [])

  // If there are 0 outputs, there should be no affect.
  // TODO: assert something

  copy.daemon++;
  copy.tape = result;

  return copy;
}

Universe.prototype.copy = function () { 
  var u1 = makeUniverse(this.tape);

  u1.daemon = this.daemon;
  u1.alive = this.alive;

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
          console.log(inputs)
          console.log(inputs.map(function (d, i) { return parseInt(d); }))
          return [parseInt(inputs[0], 10) + parseInt(inputs[1], 10)]
        }
    },
    END: END
  };

  var info = specifics[opcode]

  if (typeof info == 'function') info = info();

  return _.extend(base, info);
}


module.exports = {
  create: makeUniverse
}