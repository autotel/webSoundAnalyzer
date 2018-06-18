
var ProcessBase=require('./ProcessBase.js');

var Direction2D=function(global,stream){
    ProcessBase.call(this,global);
    var self=this;
    this.name="Direction2D";
    
    
    var last=[];
    this.receive=function(input){
        var current=input;
        self.values[0]=current.map(function(val,i){
            if (typeof last[i] == 'number'){
                return current[i]-last[i];
            }
            return 0;
        });
        last=current.slice();
        self.output(self.values[0],0);
    }
}
module.exports = Direction2D;