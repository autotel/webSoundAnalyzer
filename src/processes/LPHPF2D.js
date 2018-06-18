
var ProcessBase=require('./ProcessBase.js');
var LowPass2d=function(global,props={}){
    ProcessBase.call(this,global);
    var self=this;
    this.name="LowPass2d";
    this.addOutputChannel(1);
    var samplesAmount=500;
    var weight=0;
    for(var a=0; a<samplesAmount; a++){
        weight+=a;
    }
    weight=1/weight;
    console.log("W",weight);
    if(props.samplesAmount) samplesAmount=props.samplesAmount;
    
    var last=[];
    this.receive=function(current){
        last.push(current.slice());
        while(last.length>samplesAmount) last.shift();
        for(var spn in current){
            self.values[0][spn]=0;
            for(var t=0; t<samplesAmount; t++){
                if(last[t])
                self.values[0][spn] += weight * last[t][spn] / (samplesAmount-t);
            }
            self.values[1][spn] = current[spn] - self.values[0][spn];
        }
        self.output(self.values[0], 0);
        self.output(self.values[1], 0);
    }
}
module.exports = LowPass2d;