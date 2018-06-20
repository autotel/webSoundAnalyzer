var Plotbase = require('./PlotterBase.js');
var renderer = undefined;
function PlotCoords(srcModule, props) {
    Plotbase.call(this);
    var colors = ['red', 'green', 'blue', 'cyan', 'magenta', 'yellow'];
    var colorn = 0;

    var maxValue = { x: 0, y: 0 }
    var position = props.position || { x: 0, y: 0 }
    var size = props.size || { x: 0, y: 0 }

    if (props.highestValue) highestValue = props.highestValue;
    if (props.lowestValue) lowestValue = props.lowestValue;

    var plotterGroup=new Konva.Group();
    var square = new Konva.Rect({
        width: size.x,
        height: size.y,
        stroke: 'black',
        strokeWidth: 1
    });
    plotterGroup.add(square);
    renderer.layer.add(plotterGroup);
    function PointPlot(valFn, props) {
        var varGroup = new Konva.Group();
        console.log(colorn);
        colorn++;
        var crossHair = new Konva.Group();
        var linea = new Konva.Line({ 
            points: [-4, 0, 4, 0],
            stroke:colors[colorn]
        });
        var lineb = new Konva.Line({ 
            points: [0, -4, 0, 4],
            stroke:colors[colorn]
        });
        crossHair.add(linea);
        crossHair.add(lineb);
        var maxText = new Konva.Text({
            text: '0', align: 'right'
        });
        maxText.offsetY(-18*colorn);

        varGroup.add(maxText);
        varGroup.add(crossHair);
        plotterGroup.add(varGroup);

        this.replot = function () {
            var vals = valFn();
            var x = vals[0];
            var y = vals[1];


            maxValue.x *= 0.99;
            maxValue.y *= 0.99;

            if (x > maxValue.x) {
                maxValue.x = x;
            }
            if (y > maxValue.y) {
                maxValue.y = y;
            }

            var multx = 0.5*size.x / maxValue.x;
            var multy = 0.5*size.y / maxValue.y;
            maxText.text(JSON.stringify(maxValue));

            crossHair.setX(x * multx+(size.x/2));
            crossHair.setY(y * multy+(size.y/2));

            // console.log(x * multx,y * multy);

            
        }
        this.replot();
    }
    var plotters = [];
    this.replot = function () {
        plotterGroup.setX(position.x);
        plotterGroup.setY(position.y);
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
    console.log("PlotCoords");
    console.log(srcModule);
    console.log("module", srcModule.name, "values:", srcModule.values.length, srcModule.values);
}
PlotCoords.setRenderer = function (r) {
    renderer = r;
}
module.exports = PlotCoords;