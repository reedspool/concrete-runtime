var Universe = require('./core/Universe.js'),
    Tape = require('./core/Tape.js'),
    Block = require('./core/Block.js'),
    util = require('./util.js'),
    BaconUniverse = require('./core/BaconUniverse.js');

Bacon.Observable.prototype.dynamicInterval = function(intervalObs) {
  var self = this
  return new Bacon.EventStream(function(sink) {
    var interval = 0
    
    intervalObs.onValue(function(n) {
      interval = n
    });

    self.flatMapLatest(function (x) {
      return Bacon.later(interval, x)
    }).onValue(function(x) {
      sink(new Bacon.Next(x))
    })
    
    return function() { }
  })
}

var $input = $('#Concrete-input');
var $output = $('#Concrete-output');
var $runButton = $('#Concrete-runButton');
var $slider = $('#Concrete-speed-slider');

var interval = getSliderValue();
var runTimeBus = new Bacon.Bus();

var inputCutAndPasteStream = $input.asEventStream("cut paste").delay(1);
var inputKeyupStream = $input.asEventStream("keyup input");
var speedChangeStream = $slider.asEventStream('change');
var runButtonStream = $runButton.asEventStream('click');

function textAreaProperty(initValue) {
  var getValue;
  
  getValue = function() {
    return $input.val() || $input.html();
  };
  
  if (initValue !== null) {
    $input.html(initValue);
  }

  return inputKeyupStream
            .merge(inputCutAndPasteStream)
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
  return translateSliderValue($slider.val())
}

function translateSliderValue(val) {
  return parseInt(val, 10) * -10;
}

function triggerRunning() {
  runTimeBus.push({});
}

speedChangeStream
  .merge(runButtonStream)
  .merge(inputKeyupStream)
  .merge(inputCutAndPasteStream)
  .onValue(triggerRunning);

// Read from input
textAreaProperty()
  .toEventStream()
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

      // .dynamicInterval(speedChangeStream.map(getSliderValue))

  })
  .map(htmlOutput)
  .onValue($output.html.bind($output))

// Trigger on App ready
$(triggerRunning)