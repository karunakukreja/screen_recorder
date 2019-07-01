const electron = require('electron'); 
const desktopCapturer = electron.desktopCapturer; 
const electronScreen = electron.remote.screen; 
const shell = electron.shell; 
const fs = require('fs')
const os = require('os')
const path = require('path')

const startButton = document.getElementById('startRecording')
const stopButton = document.getElementById('stopRecording')



var SECRET_KEY = 'Karuna';
var recorder;
var blobs = [];

function startRecording() {
    var title = document.title;
    document.title = SECRET_KEY;

    electron.desktopCapturer.getSources({ types: ['window', 'screen'] }, function(error, sources) {
        if (error) throw error;
        for (let i = 0; i < sources.length; i++) {
            let src = sources[i];
            console.log("source name is : "+ src.name);
            if (src.name === "Entire screen") {
                document.title = title;

                navigator.webkitGetUserMedia({
                    audio: false,
                    video: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: src.id,
                            minWidth: 800,
                            maxWidth: 1280,
                            minHeight: 600,
                            maxHeight: 720
                        }
                    }
                }, handleStream, handleUserMediaError);
                return;
            }
        }
    });
}

function handleStream(stream) {
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = function(event) {
        console.log("data on available: true");
        blobs.push(event.data);
        console.log("pushed : "+ event.data.length);
    };
    recorder.start();
    console.log("Recorder is started.")
}

function stopRecording() {
    blobs = [];
    recorder.stop();
    
    console.log("blobs size is : " + blobs.length)
    recorder.onstop= function (event){
        toArrayBuffer(new Blob(blobs, {type: 'video/mp4'}), function(ab) {
        var buffer = toBuffer(ab);
        var file = `./videos/example1.mp4`;
        fs.writeFile(file, buffer, function(err) {
            if (err) {
                console.error('Failed to save video ' + err);
            } else {
                console.log('Saved video: ' + file);
            }
        });
    });
}
    
}

//function saveBlob(blob){
//    let fr = new FileReader()
//    fr.onload = function(){
//        if(fr.readyState == 2){
//            var buffer = new Buffer(fr.result)
//            ipcRenderer.send("SAVE_FILE", `./videos/example.webm`, buffer)
//        }
//    }
//    fr.readAsArrayBuffer(blob)
//}
function handleUserMediaError(e) {
    console.error('handleUserMediaError', e);
}

function toArrayBuffer(blob, cb) {
    let fileReader = new FileReader();
    fileReader.onload = function() {
        let arrayBuffer = this.result;
        cb(arrayBuffer);
    };
    fileReader.readAsArrayBuffer(blob);
}

function toBuffer(ab) {
    let buffer = new Buffer(ab.byteLength);
    let arr = new Uint8Array(ab);
    for (let i = 0; i < arr.byteLength; i++) {
        buffer[i] = arr[i];
    }
    return buffer;
}

startButton.addEventListener('click', function(event){
   startRecording(); 
})
stopButton.addEventListener('click', function(event){
   stopRecording(); 
})
