
var ProcessBase=require('./ProcessBase.js');

var Reducer=function(global,props){
    ProcessBase.call(this,global);
    var self=this;
    this.ratio=props.ratio||2;
    this.name="Reducer";
    this.receive=function(input){
        var ratio=this.ratio;
        for(var n =0; n<input.length; n++){
            var i=Math.floor(n/ratio);
            if (n % ratio == 0) self.values[0][i]=0;
            self.values[0][i]+=input[n]/ratio;
        }
        self.output(self.values[0]);
    }
}
module.exports = Reducer;