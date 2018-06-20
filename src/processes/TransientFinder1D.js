
var ProcessBase=require('./ProcessBase.js');
var Average=require('./Average.js');
var TransientFinder1D=function(global,props){
    ProcessBase.call(this,global);
    var self=this;
    var average=new Average(global,{length:3});
    this.name="TransientFinder";
    
    var minIntensity=0.00004;
    var intensityAdjustMultiplier=0.99;
    var tresh=minIntensity;

    this.addOutputChannel(1);
    this.addOutputChannel(2);
    this.addOutputChannel(3);


    this.receive=function(input){
        average.receive(input);
        self.values[2]=average.values[0];
        var slope=0;
        // if(tresh>minIntensity){
        //     tresh*=intensityAdjustMultiplier;
        // }
        // console.log(self.values[2]);
        if(self.values[2].length>=2){
            slope = self.values[2][1] - self.values[2][0];
            self.values[1].unshift(slope);
            var thisIntensity=Math.abs(slope);
            if (thisIntensity>tresh){
                // tresh+=thisIntensity*(1/intensityAdjustMultiplier);
                // console.log("TRANSIENT",slope);
                self.values[0].unshift(thisIntensity);
            }else{
                self.values[0].unshift(0);
            }
            // self.values[3].unshift(minIntensity);
        }
        while (self.values[0].length > input.length) self.values[0].pop();
        while (self.values[1].length > input.length) self.values[1].pop();
        while (self.values[3].length > input.length) self.values[3].pop();

        self.output(self.values[0], 0);
        self.output(self.values[1], 1);
        self.output(self.values[2], 2);
        self.output(self.values[3], 3);
    }
}
module.exports = TransientFinder1D;