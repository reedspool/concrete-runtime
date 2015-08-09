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
  return location.get('type') == 'handle'
}

function __createHandleLocation(tape, name) {
  return Immutable.Map({
    type: 'handle',
    name: name,
    tape: tape
  })
}

function __createOffsetLocation(tape, index) {
  return Immutable.Map({
    type: 'offset',
    offset: index,
    tape: tape
  })
}

function __getLocationIndex(location) {
  var index;

  if (__isHandle(location)) {
    index = location.getIn(['tape', '__handles'])[location.get('name')]
  } else {
    index = location.get('offset')
  }

  return index;
}

Tape.create = function (parsed) {
  var tape = Immutable.fromJS({
    original: parsed.original,
    blocks: parsed.blocks,
    __isTape: true,
    __handles: undefined
  })

  tape = Tape.cullHandles(tape)
  tape = Tape.halting(tape)

  return tape;
}

Tape.cullHandles = function (tape) {
  // Scan (top level) blocks for handles
  var handles = tape.get('blocks').reduce(function (memo, block, index) {
    if (block.get('name')) memo[block.get('name')] = index;
    return memo;
  }, {})

  var editedTape = tape.set('__handles', handles)

  return editedTape;
}

Tape.halting = function (tape) {
  // There need be an END token
  if ( ! Tape.contains(tape, Block.fromString('END')) ) {
    // Broken... learn more about immutablejs pls
    tape = tape.update('blocks', function (blocks) {
      return blocks.push(Block.fromString('END'))
    });
  }

  return tape;
}

Tape.fromString = function (original) { 
  var parsed = Parser.parse(original);

  return Tape.create(parsed);
}

Tape.beginning = function(tape) {
  return __createOffsetLocation(tape, 0)
}

Tape.next = function(location, n) {
  // Accept all truthy values and zero
  n = n == 0
      ? 0 
      : n || 1;

  var index = __getLocationIndex(location) + n;

  return __createOffsetLocation(location.get('tape'), index);
}

Tape.previous = function(location) {
  return Tape.next(location, -1)
}

Tape.getLocationFromHandleOrOffset = function(tape, handleOrOffset, anchor) {
  return Block.opCode(handleOrOffset) == 'number'
    ? Tape.next(anchor, parseInt(Block.getValue(handleOrOffset), 10))
    : __createHandleLocation(tape, handleOrOffset.get('code').get('value'))
}

Tape.inBounds = function(location) {
  var x = __getLocationIndex(location);

  return x >= 0 && x < location.getIn(['tape', 'blocks']).size;
};

Tape.contains = function(tape, block) {
  return tape.get('blocks').filter(function (d) {
    return Block.matches(block, d)
  }).size > 0;
}

Tape.getBlock = function(location) {
  var index = __getLocationIndex(location);
if(!location.get('tape').getIn(['blocks', index])) debugger; /* TESTING - Delete me */
  return location.get('tape').getIn(['blocks', index]);
}

Tape.getBlocks = function(location, counter) {
  var index = __getLocationIndex(location);

  if (counter < 0) {
    counter = counter * -1;
    index = index - counter;
  }

  return location.getIn(['tape', 'blocks']).slice(index, index + counter);
}

Tape.setBlock = function(location, block) {
  var index = __getLocationIndex(location);

  return location.get('tape').setIn(['blocks', index], block);
}

Tape.setBlocks = function(location, blocks) {
  var tape;
  var len = blocks.size;

  for (var i = 0; i < len; i++) {
    tape = Tape.setBlock(location, blocks.get(i));
    location = Tape.next(location);
    location = location.set('tape', tape);
  }

  return tape || location.get('tape');
}

Tape.toString = function(tape) {

  var handlePositions = [];

  var handlez = tape.get('__handles');

  for (var key in handlez) {
    handlePositions[handlez[key]] = key
  }

  return tape.get('blocks')
    .map(function (block) { return Block.toString(block) })
    .map(function (block, i) { return handlePositions[i] 
                                      ? block + '#' + handlePositions[i] 
                                      : block; })
    .join(' ')
}

