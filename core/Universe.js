var _ = require('lodash'),
    assert = require('assert'),
    config = require('./config.js'),
    util = require('./util.js'),
    Tape = require('./Tape.js'),
    Block = require('./Block.js'),
    Immutable = require('immutable');
function Universe() {}

module.exports = Universe

Universe.create = function (tape) {
  var u = Immutable.Map({})

  u = u.set('tape', tape)
  u = u.set('daemon', Tape.beginning(u.get('tape')))
  u = u.set('tape', tape)
  u = u.set('log', [])
  u = u.set('history', [])
  u = u.set('alive', true)
  u = u.set('stepsTaken', 0)

  return u;
}

Universe.die = function (universe) {
  return universe.set('alive', false)
}

Universe.fromString = function (codez) {
  var tape = Tape.fromString(codez);

  return Universe.create(tape);
}

/**
 * Step the universe exactly once.
 */

Universe.step = function (universe, environment) {
  var steps = universe.get('stepsTaken')

  if ( ! universe.get('alive') ) {
    util.log("Can't step further, I'm done!")

    return universe;
  }

  universe = Universe.record(universe);

  if ( ! Universe.daemonInBounds(universe) ) {
    util.log("Tape out of bounds :-/")

    return Universe.die(universe);
  }

  if (steps >= config.MAX_UNIVERSE_STEPS) {
    util.log("Maximum allowed steps exceeded, good bye.")

    return  Universe.die(universe);
  }
  
  universe = Universe.evaluateBlockAtDaemon(universe, environment);
 
  // ? Does immutablejs have an atomic increment?
  universe = universe.set('stepsTaken', universe.get('stepsTaken') + 1)

  return universe
};

Universe.daemonInBounds = function (universe) {
  var daemon = universe.get('daemon');

  return Tape.inBounds(daemon)
}

Universe.evaluateBlockAtDaemon = function (universe, environment) {
  var daemon = universe.get('daemon');
  var block = Tape.getBlock(daemon);
  var op_code = Block.opCode(block);
  var executable = Universe.getExecutable(op_code, environment);

  if ( ! executable ) throw new Error('Sorry, it appears that no block has been registered for ' + Block.toString(block))

  return executable(universe, environment)
}

Universe.getExecutable = function (op_code, environment) {
  var opfn;

  environment.forEach(function (d, i) {
    if (d.op == op_code) {
      // TODO: CHange this to d.executable
      opfn = d.executable
    }
  })
if(!opfn) debugger; /* TESTING - Delete me */
  return opfn;
}

Universe.record = function (universe) {
  universe.set('history', universe.get('history').push(universe.get('tape')))

  return universe; 
}

Universe.println = function (universe, input) {
  input = input.replace('_', ' ')
  return universe.set('log', universe.get('log').push(input))
}

Universe.print = function (universe, input) {
  var previous = universe.get('log');

  // Circuitously remove the last log, then append a string, then println
  universe.set('log', previous.slice(0, previous.length - 1))

  var last = previous.pop() || '';

  last += input;

  return Universe.println(universe, last);
}
