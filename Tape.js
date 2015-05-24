var _ = require('lodash'),
    assert = require('assert'),
    config = require('./config.js'),
    util = require('./util.js'),
    Parser = require('./ConcreteParser.js'),
    Immutable = require('immutable'),
    Block = require('./Block.js');

module.exports = Tape

var __proto = new Tape();

function Tape() {}

function __isHandle(location) {
  return location.__isHandle
}

function __createHandle(tape, name) {
  return Immutable.Map({
    __isHandle: true,
    name: name,
    tape: tape
  })
}

function __createOffset(tape, index) {
  return Immutable.Map({
    offset: index,
    tape: tape
  })
}

function __getLocationIndex(tape, location) {
  var index;

  if (__isHandle(location)) {
    index = tape.getIn(['__handles', location.get('handle')])
  } else {
    index = location.get('offset')
  }

  return index;
}

Tape.create = function (tape) {
  // Scan (top level) blocks for handles
  var handles = tape.blocks.reduce(function (memo, block, index) {
    if (block.name) memo[block.name] = index;
    return memo;
  }, {})

  var tape = Immutable.fromJS({
    original: tape.original,
    blocks: tape.blocks,
    __isTape: true,
    __handles: handles
  })

  // There need be an END token
  if ( ! Tape.contains(tape, 'END') ) {
    tape = tape.updateIn(['blocks'], function (blocks) {
      blocks.push(Block.fromString('END'))
    });
  }

  return tape;
}

Tape.fromString = function (original_code) { 
  var tape = Parser.parse(original_code);

  return Tape.create(tape);
}

Tape.beginning = function(tape) {
  return __createOffset(tape, 0)
}

Tape.next = function(location, n) {
  n = n || 1;

  var index = __getLocationIndex(location) + n;

  if ( ! Tape.inBounds(index)) {
    return; // Need better badstate handling
  }

  return __createOffset(location.tape, index);
}

Tape.previous = function(location) {
  return Tape.next(location, -1)
}

Tape.inBounds = function(location) {
  var x = __locationToInternalIndex(location);

  return x >= 0 && x < location.tape.get('blocks').size;
};

Tape.contains = function(tape, block) {
  return tape.get('blocks').filter(function (d) { 
    return Block.matches(block, d)
  }).length > 0;
}

Tape.getBlock = function(location) {
  var index = __getLocationIndex(location);

  return location.tape.getIn(['blocks', index]);
}

Tape.setBlock = function(location, block) {
  var index = __getLocationIndex(location);

  return location.tape.setIn(['blocks', index], block);
}

Tape.toString = function(tape) {
  var self = tape;

  var handlePositions = [];

  self.get('__handles').forEach(function (key, val) { 
    handlePositions[key] = val;
  })

  return self.get('blocks')
    .map(function (block) { return Block.toString(block) })
    .map(function (block, i) { return handlePositions[i] 
                                      ? block + '#' + handlePositions[i] 
                                      : block; })
    .join(' ')
}

