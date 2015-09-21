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
  u = u.set('extras', Immutable.Map({}))
  u = u.set('history', Immutable.List([]))
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
    util.log("Daemon out of bounds of tape! Halting.")

    return Universe.die(universe);
  }

  if (steps >= config.MAX_UNIVERSE_STEPS) {
    util.log("Maximum allowed steps exceeded! Halting.")

    return  Universe.die(universe);
  }
  
  universe = Universe.evaluateBlockAtDaemon(universe, environment);
 
  // TODO: ? Does immutablejs have an atomic increment?
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

  if ( ! executable ) throw new Error('Sorry, it appears that no block has been registered for ' + Block.toString(block) + ' opcode ' + op_code)

  return executable(universe, environment)
}

Universe.getExecutable = function (op_code, environment) {
  var opfn;

  environment.forEach(function (block, i) {
    if (block.op == op_code) {
      opfn = block.executable
    }
  })

  // Executable not found
  if(!opfn) throw new Error('Executable not found ' + op_code);
  
  return opfn;
}

Universe.record = function (universe) {
  var history = universe.get('history')

  var editedHistory = history.set(history.size, universe.get('tape'));

  return universe.set('history', editedHistory); 
}

Universe.createLogIfNone = function (universe) {
  var extras = universe.get('extras');

  var log = extras.get('log');

  if ( ! log ) {
    extras = extras.set('log', Immutable.List([]))
    return universe.set('extras', extras)
  }

  return universe;
}

Universe.println = function (universe, input) {
  input = input.replace('_', ' ');

  universe = Universe.createLogIfNone(universe)

  var logged = universe.getIn(['extras', 'log']).push(input);

  return universe.setIn(['extras', 'log'], logged)
}

Universe.print = function (universe, input) {
  if(true) debugger; /* TESTING - Delete me */
  universe = Universe.createLogIfNone(universe)

  var previous = universe.getIn(['extras', 'log']);

  // Circuitously remove the last log, then append a string, then println
  var editedLog = previous.slice(0, previous.size ? previous.size - 1 : 0);
  
  universe = universe.setIn(['extras', 'log'], editedLog);

  var last = previous.get(previous.size - 1) || '';

  last += input

  return Universe.println(universe, last);
}
