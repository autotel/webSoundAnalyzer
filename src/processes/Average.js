
var ProcessBase=require('./ProcessBase.js');

var Average=function(global,props={}){
    ProcessBase.call(this,global);
    var self=this;
    this.name="Average";
    var length=props.length||false;
    this.receive=function(input){
        self.values[0].unshift(0);
        if(!length) length=input.length;

        while(self.values[0].length>length) self.values[0].pop();

        for(var n =0; n<input.length; n++){
            self.values[0][0]+=input[n]/input.length;
        }
        self.output(self.values[0]);
    }
}
module.exports = Average;