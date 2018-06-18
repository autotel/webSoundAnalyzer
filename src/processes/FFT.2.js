
var ProcessBase=require('./ProcessBase.js');
const spectrumAnalyzer = require('fourier-transform');
var db = require('decibels');

var FFT=function(global,stream){
    ProcessBase.call(this,global);
    var self=this;
    
    this.name="FFTProcess";
    this.addOutputChannel(1);
    
    // var updateSize=function(to){
    //     console.warn(self.name+" change of fft size from "+self.values[0].length+" to ",to);
    //     var newSize=to;
    //     var nextPo2 = Math.pow(2, Math.ceil(Math.log(newSize)/Math.log(2)));
    //     if(nextPo2!==newSize){
    //         console.warn(self.name+" length adjusted from "+newSize+" to "+nextPo2+" to make it power of two");
    //     }
    //     spectrumAnalyzer = new Analyzer(nextPo2);
    // }

    this.receive=function(inBuffer){

        self.values[0] = spectrumAnalyzer(inBuffer)//.map((value) => db.fromGain(value));
        // self.values[1] = self.values[0].splice()
        self.output(self.values[0],0);
        self.output(self.values[1],1);
    }
}
module.exports=FFT;