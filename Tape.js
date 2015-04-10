var _ = require('lodash'),
    assert = require('assert'),
    config = require('./config.js'),
    util = require('./util.js'),
    Block = require('./Block.js');

module.exports = Tape

var __proto = new Tape();

function Tape() {}

function __addressToI(address) { 
  return address * -1;
}

function __iToAddress(i) {
  return i * -1;
}

Tape.create = function (blocks) {
  var tape = Object.create(__proto);

  tape.__mess = true;

  tape.__blocks = [];
  tape.__history = [];
  tape.__handles = {
    FIRST: 0,
    LAST: 0
  };

  tape.spliceArray(0, 0, blocks);

  // There need be an END token
  if ( ! tape.contains('END') ) tape.set(tape.length(), Block.fromString('END'))

  tape.__mess = false;
  tape.dirty();

  return tape;
}

Tape.fromString = function (codez) { 
  var words = codez.split(config.WORD_DELIM);


  var namesplit = words.map(function (w) { 
      return w.split(config.NAME_DELIM)
  })

  var blocks = namesplit.map(function (split) { 
    return split[0];
  }).map(Block.fromString)

  var tape = Tape.create(blocks)

  namesplit.map(function (split) { 
    return split[1];
  }).forEach(function (handle, i) { 
    if ( ! handle ) return;

    tape.setHandleAddress(handle, __iToAddress(i))
  })


  return tape;
}

Tape.prototype.getHandleAddress = function(handle) {
  return __iToAddress(this.__handles[handle])
};

Tape.prototype.setHandleAddress = function(handle, address) {
  this.__handles[handle] = __addressToI(address)

  this.dirty();
};

Tape.prototype.inBounds = function(address) {
  var x = __addressToI(address);

  return x >= 0 && x < this.length();
};

Tape.prototype.getAddressIndex = function (address) {
  return __addressToI(address)
}

Tape.prototype.contains = function(word) {
  return this.__blocks.filter(function (d) { 
    return d.matches(word);
  }).length > 0;
}

Tape.prototype.splice = function(address, n, stuff) {
  // Pass through
  var i = __addressToI(address);

  arguments[0] = i;

  var result = [].splice.apply(this.__blocks, arguments);

  this.dirty();

  return result;
};

Tape.prototype.spliceArray = function (a, b, c) {
  this.splice.apply(this, [a, b].concat(c))
}

Tape.prototype.forEach = function(fn) {
  this.__blocks.forEach(fn)
};

Tape.prototype.previous = function(address, n) {
  var addr = __iToAddress(__addressToI(address) - 1);

  if (n && n > 1) return this.previous(addr, n - 1);

  return addr;
};

Tape.prototype.next = function(address, n) {
  var addr = __iToAddress(__addressToI(address) + 1);

  if (n) return this.next(addr, n - 1);

  return addr;
};

Tape.prototype.get = function(address, n) {
  var i = __addressToI(address)

  if (typeof n !== 'undefined') {
    if (n < 0) {
      n = n * -1;
      address = this.previous(address, n); 
    }

    return this.copy().splice(address, n)
  }

  return this.__blocks[i];
};

Tape.prototype.set = function(address, block) {
  var i = __addressToI(address)

  this.dirty();

  this.__blocks[i] = block;
};

Tape.prototype.length = function() {
  return this.__blocks.length;
};

Tape.prototype.toString = function() {
  var self = this;

  var handlePositions = [];

  _.each(self.__handles, function (val, key) { 
    if (key == 'LAST' || key == 'FIRST') return;

    handlePositions[val] = key;
  })

  return self.__blocks
    .map(function (block) { return block.toString() })
    .map(function (block, i) { return handlePositions[i] 
                                      ? block + '#' + handlePositions[i] 
                                      : block; })
    .join(' ')
};

Tape.prototype.dirty = function() {
  if (this.__mess) return;

  this.__handles.LAST = this.length() - 1;

  this.__history.push(this.toString());
};

Tape.prototype.copy = function() {
  var tape = Tape.create(this.__blocks.map(function (b) {
      return b.copy();
    }));

  tape.__handles = this.__handles;

  this.dirty();

  return tape;
};
