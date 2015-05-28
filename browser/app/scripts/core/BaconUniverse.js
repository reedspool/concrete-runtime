var Bacon = require('baconjs')

exports.asStream = function(universe) {
  return Bacon.fromBinder(function(sink) {
    
    sink(universe.copy());

    function stepSink() { 
      if (universe.alive) {
        universe = universe.step()
        sink(universe.copy())
      } else {
        sink(Bacon.noMore)
      }
    }

    var interval = setInterval(stepSink, 0)

    return function() {};
  });

}

exports.asBlockingStream = function(universe) {
  return Bacon.fromBinder(function(sink) {
    
    sink(universe.copy());

    while (universe.alive) {
      universe = universe.step()
      sink(universe.copy())
    }

    sink(Bacon.noMore)

    return function() {};
  });

}


