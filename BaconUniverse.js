var Bacon = require('baconjs')

exports.asStream = function(universe) {
  return Bacon.fromBinder(function(sink) {
    
    sink(universe);

    function stepSink() { 
      if (universe.alive) {
        sink(universe = universe.step())
      } else {
        sink(Bacon.noMore)
      }
    }

    var interval = setInterval(stepSink, 60)

    return function() {};
  });

}

exports.asBlockingStream = function(universe) {
  return Bacon.fromBinder(function(sink) {
    
    sink(universe);

    while (universe.alive) {
      sink(universe = universe.step())
    }

    return function() {};
  });

}


