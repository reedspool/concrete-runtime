var Bacon = require('baconjs')

exports.asStream = function(universe) {
  return Bacon.fromBinder(function(sink) {
    
    sink(universe);

    function stepSink() { 
      if (universe.alive) {
        sink(universe = universe.step())
      }
    }

    var interval = setInterval(stepSink, 60)

    return function() {};
  });

}

