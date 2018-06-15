
var ProcessBase=require('./ProcessBase.js');
const Analyzer = require('fft.js');
var FFT=function(global,stream){
    ProcessBase.call(this,global);
    var self=this;
    
    this.name="FFTProcess";
    this.addOutputChannel(1);
    
    var spectrumAnalyzer = new Analyzer(1024);

    var updateSize=function(to){
        console.warn(self.name+" change of fft size from "+self.values[0].length+" to ",to);
        var newSize=to;
        var nextPo2 = Math.pow(2, Math.ceil(Math.log(newSize)/Math.log(2)));
        if(nextPo2!==newSize){
            console.warn(self.name+" length adjusted from "+newSize+" to "+nextPo2+" to make it power of two");
        }
        spectrumAnalyzer = new Analyzer(nextPo2);
    }

    this.receive=function(inBuffer){
        if(inBuffer.length/1!==self.values[0].length){
            updateSize(inBuffer.length/1);
        }
        var out = new Array(inBuffer.length);
        spectrumAnalyzer.realTransform(out, inBuffer);
        // spectrumAnalyzer.completeSpectrum(out);
        for (var i in out){
            // if (!self.values[i & 1]) self.values[i & 1]=[];
            //i&1=short de-interlace two
            self.values[i&1][Math.floor(i/2)]=out[i];
        };
        self.output(self.values[0],0);
        self.output(self.values[1],1);
    }
}
module.exports=FFT;