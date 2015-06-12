var Bacon = require('baconjs')
  , Universe = require('./Universe.js')
  , blocks = [
          require('./blocks/BlankBlock.js'),
          require('./blocks/BlockUtilities.js'),
          require('./blocks/CallBlock.js'),
          require('./blocks/ConditionalBlock.js'),
          require('./blocks/EndBlock.js'),
          require('./blocks/FoldBlock.js'),
          require('./blocks/GetBlock.js'),
          require('./blocks/GreaterThanBlock.js'),
          require('./blocks/JumpBlock.js'),
          require('./blocks/MoveBlock.js'),
          require('./blocks/NumberBlock.js'),
          require('./blocks/PrintBlock.js'),
          require('./blocks/PrintLineBlock.js'),
          require('./blocks/ProductBlock.js'),
          require('./blocks/SumBlock.js')
  ];

Universe.asStream = function(universe) {
  return Bacon.fromBinder(function(sink) {
    
    sink(universe);

    function stepSink() { 
      if (universe.get('alive')) {
        universe = Universe.step(universe, blocks)
        sink(universe)
      } else {
        sink(Bacon.noMore)
      }
    }

    var interval = setInterval(stepSink, 0)

    return function() {};
  });

}

Universe.asBlockingStream = function(universe) {
  return Bacon.fromBinder(function(sink) {
    
    sink(universe);

    while (universe.get('alive')) {
      universe = Universe.step(universe, blocks)
      sink(universe)
    }

    sink(Bacon.noMore)

    return function() {};
  });

}

module.exports = Universe


