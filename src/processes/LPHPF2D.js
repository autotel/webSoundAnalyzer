
var ProcessBase=require('./ProcessBase.js');
var LowPass2d=function(global,props={}){
    ProcessBase.call(this,global);
    var self=this;
    this.name="LowPass2d";
    this.addOutputChannel(1);
    this.addOutputChannel(2);
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
            self.values[1][spn] = current[spn]-self.values[0][spn];
            self.values[2][spn] = Math.max(0, current[spn]-self.values[0][spn]);
        }
        self.output(self.values[0], 0);
        self.output(self.values[1], 1);
        self.output(self.values[2], 2);
    }
}
module.exports = LowPass2d;