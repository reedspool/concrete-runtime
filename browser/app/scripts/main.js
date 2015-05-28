var Universe = require('./core/Universe.js'),
    Tape = require('./core/Tape.js'),
    BaconUniverse = require('./core/BaconUniverse.js');

var INTERVAL = 100;

var $input = $('#Concrete-input');
var $output = $('#Concrete-output');

var textAreaProperty = function(textfield, initValue) {
  var getValue;
  getValue = function() {
    return textfield.val() || textfield.html();
  };
  if (initValue !== null) {
    textfield.html(initValue);
  }
  return textfield.asEventStream("keyup input")
            .merge(textfield.asEventStream("cut paste").delay(1))
            .map(getValue)
            .toProperty(getValue())
            .skipDuplicates();
};

// Read from input
textAreaProperty($input)
  .debounce(500)

  // Parse universe
  .map(Universe.fromString)

  // Run universe
  .flatMapLatest(function (universe) {
    return BaconUniverse.asStream(universe)
      // Until no more...
      .filter(function (d) { return !(d[0] && d[0] == '<no-more>'); })

      // Back to string
      .map(function (u) { return Tape.toString(u.tape) })


      // Then animate it nicely over an interval
      .bufferingThrottle(INTERVAL)

  })
      .onValue($output.val.bind($output))
