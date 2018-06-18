
var ProcessBase=require('./ProcessBase.js');

var Truncator=function(global,props){
    ProcessBase.call(this,global);
    var self=this;
    start=props.start||0
    end=props.end||512;
    this.name="Reducer";
    this.receive=function(input){
        var ratio = (end - start) / input.length;
        var inLen=Math.floor(input.length*ratio);
        for (var n = 0; n < inLen; n++){
            var on=Math.floor((n*ratio)+start);
            // console.log(on);
            self.values[0][n]=input[on];
        }
        self.output(self.values[0]);
    }
}
module.exports = Truncator;