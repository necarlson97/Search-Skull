var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.start();
recognition.onresult = function(event) {
    var spoken = event.results[event.results.length-1][0].transcript.trim();
    input.value = spoken;
    trigger();
};

var input;

window.onload = function() {
    input = document.getElementById('input');
    video = document.getElementsByTagName("video")[0];
    
    activateCamera();
}

function wikiSearch(s) {
    $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        data: { action: 'query', list: 'search', 
               srsearch: s, format: 'json' },
        dataType: 'jsonp',
        success: wikiResults
    });
}

function wikiResults(apiResult){
    var searchTitle = apiResult.query.search[0].title;
    $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        data: { action: 'query', prop: 'extracts', exintro: 'explaintext',
               titles: searchTitle, format: 'json' },
        dataType: 'jsonp',
        success: wikiOutput
    });
}

function wikiOutput(apiResult) {
    var extract = "";
    for(var page in apiResult.query.pages) {
        extract = apiResult.query.pages[page].extract;
    }
    speak(extract.replace(/<(?:.|\n)*?>/gm, ''));
}

function trigger() {
    var text = input.value;
    if(text == "stop" || text == "shut up") {
        responsiveVoice.cancel();
        speak("stopping");
    } else wikiSearch(text);
}

function speak(s) {
    responsiveVoice.speak(s, "UK English Male", {rate: 1, pitch: .5});
}

var video;

function activateCamera() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

    if (navigator.getUserMedia) {       
        navigator.getUserMedia({video: true}, handleVideo, videoError);
    }
}

function handleVideo(stream) {
    video.src = window.URL.createObjectURL(stream);
}

function videoError(e) {
    alert("Webcam Error\n(see console for details)");
    console.log(e);
}

