var Bacon = require('baconjs')

exports.asStream = function(universe) {
  return Bacon.fromBinder(function(sink) {
    sink(universe);
    
    while (universe.alive)  {
      sink(universe = universe.step())
    } 

    return function() {};
  });

}

