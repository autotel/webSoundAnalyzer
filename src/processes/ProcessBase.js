// var Observable=require('onhandlers');
var Process=function(){
    var self=this;
    this.values=[[]];
    this.name="process";
    this.outputs=[new Set()];
    this.addOutputChannel=function(chn){
        this.outputs[chn]=new Set();
        this.values[chn]=[];
    }
    this.receive=function(values,inputN=0){
        for(var a in values){
            self.values[inputN][a]=values[a];
        }
    }
    this.output=function(values,outputN=0){  
        self.outputs[outputN].forEach(function(output){
            output.receive(values);
        });
    }

    this.connectTo=function(process,outputN=0){
        if(typeof process.receive=="function"){
            self.outputs[outputN].add(process);
        }else{
            console.warn("couln't connect "+self.name+" because is not a Process, to", process);
        }
    }
}
module.exports=Process;