
var ProcessBase=require('./ProcessBase.js');
const Spectrum = require('spectrum-analyzer');
var FFT=function(global,stream){
    ProcessBase.call(this,global);
    var self=this;
    
    this.name="FFTProcess";
    this.addOutputChannel(1);
    var spectrumSize=1024;

    var spectrumAnalyzer = new Spectrum(spectrumSize);

    var updateSize=function(to){
        console.warn(self.name+" change of fft size from "+self.values[0].length+" to ",to);
        newSize=to;
        spectrumSize = Math.pow(2, Math.ceil(Math.log(newSize)/Math.log(2)));
        if(newSize!==to){
            console.warn(self.name + " length adjusted from " + newSize + " to " + spectrumSize+" to make it power of two");
        }
        spectrumAnalyzer = new Spectrum(spectrumSize);
    }

    this.receive=function(inBuffer){
        var expand=2;
        self.values[0]=new Array(inBuffer.length);
        // console.log(inBuffer.length)
        if(spectrumSize!=inBuffer.length){
            updateSize(inBuffer.length);
        }
        // if(inBuffer.length/expand!==self.values[0].length){
        //     updateSize(inBuffer.length/expand);
        // }
        // inBuffer=inBuffer.map(x => x * 200);
        inBuffer=inBuffer.map(x => Math.atan(x));
        // console.log(inBuffer);
        spectrumAnalyzer.appendData(inBuffer);
        spectrumAnalyzer.recompute();
        var power=spectrumAnalyzer.getPower();
        var phase=spectrumAnalyzer.getPhase();
        for (var n=0; n<power.length; n++){
            // self.values[0][n] = Math.pow(10, power[Math.round(n / expand)]);
            self.values[0][n] = power[Math.round(n/expand)];
        }
        for (var a in phase.length) {
            self.values[1][n] = phase[Math.round(n/expand)];
        }
        // console.log(self.values[0]);
        self.output(self.values[0],0);
        self.output(self.values[1],1);
    }
}
module.exports=FFT;