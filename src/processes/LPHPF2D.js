
var ProcessBase=require('./ProcessBase.js');
var LowPass2d=function(global,props={}){
    ProcessBase.call(this,global);
    var self=this;
    this.name="LowPass2d";
    this.addOutputChannel(1);
    var splQ=100;

    if(props.splQ) splQ=props.splQ;
    var last=[];
    this.receive=function(current){
        last.push(current.slice());
        while(last.length>splQ) last.shift();
        var totalWeight=0;
        for(var spn in current){
            var dotP=0;
            var twe=0;
            for(var t=0; t<splQ; t++){
                if(last[t]){
                    var we=splQ-t;
                    twe += we;
                    dotP += last[t][spn] * we;
                }
            }
            self.values[0][spn] = dotP/twe;
            self.values[1][spn] = self.values[0][spn]-current[spn];
        }
        self.output(self.values[0], 0);
        self.output(self.values[1], 0);
    }
}
module.exports = LowPass2d;