var _ = require('lodash'),
    assert = require('assert'),
    config = require('./config.js'),
    util = require('./util.js'),
    Parser = require('./ConcreteParser.js'),
    Block = require('./Block.js');

module.exports = Tape

var __proto = new Tape();

function Tape() {}

function __addressToInternal(address) { 
  return address * -1;
}

function __internalToAddress(i) {
  return i * -1;
}

Tape.create = function (blocks) {
  var tape = Object.create(__proto);

  tape.__blocks = blocks;

  // TODO: REGISTER ALL HANDLEZ by scanning blocks
  
  tape.__handles = {
    
  };

  // There need be an END token
  if ( ! tape.contains('END') ) tape.set(tape.length(), Block.fromString('END'))

  return tape;
}

Tape.fromString = function (codez) { 
  var blocks = Parser.parse(codez).blocks;

  return this.create(blocks);
}

Tape.prototype.getHandleAddress = function(handle) {
  return __internalToAddress(this.__handles[handle])
};

Tape.prototype.setHandleAddress = function(handle, address) {
  this.__handles[handle] = __addressToInternal(address)
};

Tape.prototype.inBounds = function(address) {
  var x = __addressToInternal(address);

  return x >= 0 && x < this.length();
};

Tape.prototype.getAddressIndex = function (address) {
  return __addressToInternal(address)
}

Tape.prototype.contains = function(word) {
  return this.__blocks.filter(function (d) { 
    return d.matches(word);
  }).length > 0;
}

Tape.prototype.splice = function(address, n, stuff) {
  // Pass through
  var i = __addressToInternal(address);

  arguments[0] = i;

  var result = [].splice.apply(this.__blocks, arguments);

  return result;
};

Tape.prototype.spliceArray = function (a, b, c) {
  this.splice.apply(this, [a, b].concat(c))
}

Tape.prototype.forEach = function(fn) {
  this.__blocks.forEach(fn)
};

Tape.prototype.previous = function(address, n) {
  var addr = __internalToAddress(__addressToInternal(address) - 1);

  if (n && n > 1) return this.previous(addr, n - 1);

  return addr;
};

Tape.prototype.next = function(address, n) {
  var addr = __internalToAddress(__addressToInternal(address) + 1);

  if (n) return this.next(addr, n - 1);

  return addr;
};

Tape.prototype.get = function(address, n) {
  var i = __addressToInternal(address)

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
  var i = __addressToInternal(address)

  this.__blocks[i] = block;
};

Tape.prototype.length = function() {
  return this.__blocks.length;
};

Tape.prototype.toString = function() {
  var self = this;

  var handlePositions = [];

  _.each(self.__handles, function (key, val) { 
    handlePositions[key] = val;
  })

  return self.__blocks
    .map(function (block) { return block.toString() })
    .map(function (block, i) { return handlePositions[i] 
                                      ? block + '#' + handlePositions[i] 
                                      : block; })
    .join(' ')
};

Tape.prototype.copy = function() {
  var tape = Tape.create(this.__blocks.map(function (b) {
      return b.copy();
    }));

  tape.__handles = this.__handles;

  return tape;
};
