
var ProcessBase = require('./ProcessBase.js');

var LPF2Dsimple = function (global, props) {
    ProcessBase.call(this, global);
    var self = this;
    this.name = "Direction2D";
    var splQ = 100;
    if (props.splQ) splQ = props.splQ;
    var ma=1/splQ;
    var mb=splQ;

    var last = [];
    this.receive = function (input) {
        var current = input;
        self.values[0] = current.map(function (val, i) {
            if (typeof last[i] == 'number') {
                return (val + last[i]);
            }
            return 0;
        });
        last = current.slice();
        self.output(self.values[0], 0);
    }
}
module.exports = LPF2Dsimple;