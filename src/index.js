console.log("hui");

const FFT=require('./processes/FFT.2.js');
const MicrophoneInputProcess=require('./processes/MicrophoneInput.js');
const ProcessBase = require('./processes/ProcessBase.js');
const Direction2D = require('./processes/Direction2D');
const Reducer = require('./processes/Reducer.js');
const Truncator = require('./processes/Truncate.js');
const LowPass2d = require('./processes/LPHPF2D');
const Average = require('./processes/Average');
const SplitBuffer = require('./processes/SplitBuffer');
const TransientFinder = require('./processes/TransientFinder1D');
const plotters=require('./plotters');

var handleSuccess = function(stream) {
    var global={}

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    

    global.audioContext=audioCtx;
    
    var input=new MicrophoneInputProcess(global,stream);
    var fft=new FFT(global);
    var dir2d = new Direction2D(global);
    var truncator = new Truncator(global,{start:10,end:256});
    var lpf = new LowPass2d(global);
    var lpff = new LowPass2d(global, { splQ: 10 });
    var splitb = new SplitBuffer(global,{slices:8});
    var transfind = new TransientFinder(global);
    input.connectTo(fft);
    fft.connectTo(dir2d);
    fft.connectTo(truncator);
    truncator.connectTo(lpf);
    lpf.connectTo(lpff,2);
    lpff.connectTo(transfind)
    // splitb.connectTo(avg);


    var plot1 = new plotters.Plot1D(input,{size:{x:500,y:200},position:{x:0,y:0}});
    var plot2 = new plotters.Plot1D(fft,{size:{x:500,y:200},position:{x:0,y:200}});
    var plot3 = new plotters.Plot1D(dir2d, { size: { x: 500, y: 200 }, position: { x: 0, y: 400 } });
    var plot4 = new plotters.Plot1D(truncator, { size: { x: 500, y: 200 }, position: { x: 0, y: 600 } });
    var plot5 = new plotters.Plot1D(lpf, { size: { x: 500, y: 200 }, position: { x: 0, y: 800 } });
    var plot6 = new plotters.Plot1D(lpff, { size: { x: 500, y: 200 }, position: { x: 0, y: 1000 } });
    var plot7 = new plotters.Plot1D(transfind, {
        size: { x: 500, y: 200 }, position: { x: 0, y: 1200 },
        colors:["red","#CCC","#DDD","#EEE"]
    });
    var plot8 = new plotters.PlotCoords(transfind, { size: { x: 500, y: 200 }, position: { x: 0, y: 1400 } });

    plotters.animQueue.push(plot1.replot);
    plotters.animQueue.push(plot2.replot);
    plotters.animQueue.push(plot3.replot);
    plotters.animQueue.push(plot4.replot);
    plotters.animQueue.push(plot5.replot);
    plotters.animQueue.push(plot6.replot);
    plotters.animQueue.push(plot7.replot);
    plotters.animQueue.push(plot8.replot);
};

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.');
    navigator.mediaDevices.getUserMedia (
       // constraints - only audio needed for this app
       {
          audio: true
       })
 
       // Success callback
       .then(handleSuccess)
 
       // Error callback
       .catch(function(err) {
          console.log('The following getUserMedia error occured: ' );
          console.error(err);
       }
    );
 } else {
    console.log('getUserMedia not supported on your browser!');
 }