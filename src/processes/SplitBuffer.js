
var ProcessBase=require('./ProcessBase.js');

var SplitBuffer=function(global,props={}){
    ProcessBase.call(this,global);
    var self=this;
    var slices=props.slices||2;
    console.log("SLOC",slices);
    this.name="SplitBuffer";
    this.receive=function(input){
        var lastSlice=0;
        var sliceSize=Math.floor(input.length/slices);
        // console.log(sliceSize);
        for(var n =0; n<input.length; n++){
            var slice=Math.floor(n/sliceSize);
            if(slice!=lastSlice){
                self.output(self.values[0]);
                self.values[0]=[];
            }
            self.values[0][n%sliceSize]=input[n];
            lastSlice=slice;
        }
    }
}
module.exports = SplitBuffer;