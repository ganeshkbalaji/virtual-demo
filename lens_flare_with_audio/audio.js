var context;
var source, sourceJs;
var analyser;
var url = 'RATATAT_CREAMONCHROME.mp3';
var array = new Array();
var boost = 0;

try {
  if(typeof webkitAudioContext === 'function' || 'webkitAudioContext' in window) {
    context = new webkitAudioContext();
  }
  else {
    context = new AudioContext();
  }
}
catch(e) {
  $('#info').text('Web Audio API is not supported in this browser');
}

var request = new XMLHttpRequest();
request.open("GET", url, true);
request.responseType = "arraybuffer";

request.onload = function() {
  context.decodeAudioData(
    request.response,
    function(buffer) {
      sourceJs = context.createScriptProcessor(2048, 1, 1);
      sourceJs.buffer = buffer;
      sourceJs.connect(context.destination);
      analyser = context.createAnalyser();
      analyser.smoothingTimeConstant = 0.6;
      analyser.fftSize = 512;

      source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      source.connect(analyser);
      analyser.connect(sourceJs);
      source.connect(context.destination);

      sourceJs.onaudioprocess = function(e) {
        array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        boost = 0;
        for (var i = 0; i < array.length; i++) {
                boost += array[i];
            }
            boost = boost / array.length;
            // console.log(boost);
      };

      // $('body').append('<button onclick="play()">play music</button>');

      // $('body').append($('<div onclick="body" id="play" style="width: ' + $(window).width() + 'px; height: ' + $(window).height() + 'px;"><div id="play_link"></div></div>'));
      // $('#play_link').css('top', ($(window).height() / 2 - $('#play_link').height() / 2) + 'px');
      // $('#play_link').css('left', ($(window).width() / 2 - $('#play_link').width() / 2) + 'px');
      // $('#play').fadeIn();
    }
  );
  $('body').on('click', function(){
    console.log("test");
    source.start(0);
  });
};

request.send();
