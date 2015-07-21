var Universe = require('./core/Universe.js'),
    Tape = require('./core/Tape.js'),
    Block = require('./core/Block.js'),
    BaconUniverse = require('./core/BaconUniverse.js');


var $input = $('#Concrete-input');
var $output = $('#Concrete-output');
var $runButton = $('#Concrete-runButton');
var $slider = $('#Concrete-speed-slider');

var interval = getSliderValue();
var runTimeBus = new Bacon.Bus();

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
            .map(getValue)
            .toProperty(getValue())
            .skipDuplicates()
            .debounce(500);
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

function getSliderValue() { 
  return parseInt($slider.val(), 10) * -10
}

function triggerRunning() {
  runTimeBus.push({});
}

$slider.asEventStream('change')
  .merge($runButton.asEventStream('click'))
  .merge($input.asEventStream("keyup input"))
  .onValue(triggerRunning);

// Read from input
textAreaProperty($input)

  .sampledBy(runTimeBus)

  // Parse universe
  .map(Universe.fromString)

  // Run universe
  .flatMapLatest(function (universe) {
    
    interval = getSliderValue();

    return BaconUniverse.asStream(universe)
      // Until no more...
      .filter(function (d) { return !(d[0] && d[0] == '<no-more>'); })

      // Then animate it nicely over an interval
      .bufferingThrottle(interval)

  })
  .map(htmlOutput)
  .onValue($output.html.bind($output))
