var Plotbase=require('./PlotterBase.js');
var renderer=undefined;
function PlotCoords(srcModule, props) {
    Plotbase.call(this);
    var colors = ['red', 'green', 'blue', 'cyan', 'magenta', 'yellow'];
    var colorn = 0;
    
    var highestValue = 0;
    var lowestValue = 0;
    if (props.highestValue) highestValue = props.highestValue;
    if (props.lowestValue) lowestValue = props.lowestValue;

    function PointPlot(valFn, props) {
        var position = props.position || { x: 0, y: 0 }
        var size = props.size || { x: 0, y: 0 }
        var group = new Konva.Group();
        console.log(colorn);
        colorn++;
        var crossHair =  new Konva.Group();
        var linea = new Konva.line({ points: [-4, 0, 4, 0] });
        var lineb = new Konva.line({ points: [0, -4, 0, 4] });
        crossHair.add(linea);
        crossHair.add(lineb);
        var xMaxText = new Konva.Text({
            text: '0', align: 'right'
        });
        var xMinText = new Konva.Text({ text: '0' });
        var yMaxText = new Konva.Text({ text: '0' });
        var yMinText = new Konva.Text({ text: '0' });
        yMinText.offsetY(18);
        xMaxText.offsetY(18);
        group.add(xMaxText);
        group.add(xMinText);
        group.add(yMaxText);
        group.add(yMinText);
        group.add(crossHair);
        renderer.layer.add(group);

        this.replot = function () {
            var vals=valFn();
            var x=vals[0];
            var y=vals[1];
            
        }
        this.replot();
    }
    var plotters = [];
    this.replot = function () {
        for (var a in plotters) {
            // console.log("REP",a);
            plotters[a].replot();
        }

    }
    var VFN = function (n) {
        this.p = function () {
            // console.log("P",a);
            // console.log(srcModule.values[a]);
            return srcModule.values[n];
        }
    };
    for (var a in srcModule.values) {
        plotters.push(new PointPlot(new VFN(a).p, props));
    }
    console.log(srcModule);
    console.log("module", srcModule.name, "values:", srcModule.values.length, srcModule.values);
}
PlotCoords.setRenderer=function(r){
    renderer=r;
}
module.exports=Plot1D;