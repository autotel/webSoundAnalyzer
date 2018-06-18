
var ProcessBase=require('./ProcessBase.js');

var TransientFinder1D=function(global,stream){
    ProcessBase.call(this,global);
    var self=this;
    
    this.length=1024*16;

    this.name="TransientFinder";

    this.receive=function(input){
        var ipt = Array.prototype.slice.call(input);
        // console.log(ipt);
        self.values[0].concat(ipt)
        if(self.values[0].length>self.length){
            self.values[0].splice(0,self.values[0].length-self.length);
            console.log(self.values[0].length - self.length);
        }
        // console.log(self.values[0]);
        self.output(self.values[0],0);
    }
}
module.exports = TransientFinder1D;