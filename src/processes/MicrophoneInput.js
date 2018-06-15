
var ProcessBase=require('./ProcessBase.js');
var MicrophoneInput=function(global,stream){
    ProcessBase.call(this,global);
    var audioCtx=global.audioContext;
    var self=this;
    this.name="MicrophoneInputProcess";
    var source = audioCtx.createMediaStreamSource(stream);
    var processor = audioCtx.createScriptProcessor(1024, 1, 1);
    source.connect(processor);
    processor.connect(audioCtx.destination);
    processor.onaudioprocess = function(e) {
        // Do something with the data, i.e Convert this to WAV
        var chanCount=0;
        // while(e.inputBuffer.getChannelData(chanCount)){
        self.values[0]=e.inputBuffer.getChannelData(chanCount);
        self.output(self.values[0],chanCount);
            
        // }
    };
    this.receive=function(){
        console.warn(self.name+" should not receive input");
    }
}
module.exports=MicrophoneInput;