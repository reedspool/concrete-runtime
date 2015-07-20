var Universe = require('./core/Universe.js'),
    Tape = require('./core/Tape.js'),
    Block = require('./core/Block.js'),
    BaconUniverse = require('./core/BaconUniverse.js');

var INTERVAL = 100;

var $input = $('#Concrete-input');
var $output = $('#Concrete-output');
var $runButton = $('#Concrete-runButton');

function textAreaProperty($textfield, initValue) {
  var getValue;
  getValue = function() {
    return $textfield.val() || $textfield.html();
  };
  if (initValue !== null) {
    $textfield.html(initValue);
  }
  return $textfield.asEventStream("keyup input")
            .merge($textfield.asEventStream("cut paste").delay(1))
            .merge($runButton.asEventStream('click'))
            .map(getValue)
            .toProperty(getValue())
            .skipDuplicates();
}

function htmlOutput(universe) {
  var tape = universe.get('tape');
  var daemon = universe.get('daemon');
  var offset = daemon.get('offset');

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
    .map(function (block, i) { 
      var className = 'block';

      if (i == offset) className += ' daemon';

      return '<div class="'
            + className
            + '">'
            + block
            + '</div>'
    })
    .join(' ')
}

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

      // Then animate it nicely over an interval
      .bufferingThrottle(INTERVAL)

  })
  .map(htmlOutput)
  .onValue($output.html.bind($output))
