var Plotbase=require('./PlotterBase.js');
var renderer=undefined;
function Plot1D(srcModule, props) {
    Plotbase.call(this);
    var colors = ['red', 'green', 'blue', 'cyan', 'magenta', 'yellow'];
    var plotn = 0;
    var position = props.position || { x: 0, y: 0 }
    var size = props.size || { x: 0, y: 0 }
    var group = new Konva.Group();
    function VarPlot(valFn, props) {
        var plotLine = new Konva.Line({
            points: [0, 0],
            stroke: colors[plotn],
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round'
        });
        var xMaxText = new Konva.Text({
            text: '0', align: 'right',
            fill: colors[plotn],
        });
        var xMinText = new Konva.Text({ 
            text: '0',
            fill: colors[plotn],
        });
        var yMaxText = new Konva.Text({ 
            text: '0',
            fill: colors[plotn],
        });
        var yMinText = new Konva.Text({ 
            text: '0',
            fill: colors[plotn],
        });
        yMinText.offsetY(18*(plotn+1));
        xMaxText.offsetY(18*(plotn+1));
        group.add(plotLine);
        group.add(xMaxText);
        group.add(xMinText);
        group.add(yMaxText);
        group.add(yMinText);
        renderer.layer.add(group);

        var highestValue = 0;
        var lowestValue = 0;
        plotn++;

        this.replot = function () {
            var raw = valFn();

            // console.log("data",raw);
            if (!raw) {
                console.warn("plot values is", raw); return false;
            }
            var dataset = Array.from(raw);

            dataset.map(function (a) {
                if (a != Infinity && a != -Infinity) {
                    if (a > highestValue) {
                        highestValue = a; console.log(srcModule.name, "grap's new hi", highestValue);
                    }
                    if (a < lowestValue) {
                        lowestValue = a; console.log(srcModule.name, "grap's new lo", lowestValue);
                    }
                }
            });

            var normalizeValue = 1 / (highestValue - lowestValue);

            var heightNormalizeValue = size.y / (highestValue - lowestValue);
            var plotPoints = [];
            var stepWidthPx = size.x / dataset.length
            for (var n in dataset) {
                //x pos
                plotPoints.push(stepWidthPx * n);
                //ypos
                plotPoints.push(size.y - ((dataset[n] - lowestValue) * heightNormalizeValue));
                //console.log(dataset[n]*heightNormalizeValue);
            }
            plotLine.points(plotPoints);

            xMaxText.text(dataset.length);
            xMinText.text("");
            yMaxText.text(highestValue);
            yMinText.text(lowestValue);

            xMinText.setX(0);
            xMinText.setY(size.y);

            xMaxText.setX(size.x);
            xMaxText.setY(size.y);

            yMinText.setX(0);
            yMinText.setY(size.y);

            yMaxText.setX(0);
            yMaxText.setY(0);

            group.setX(position.x);
            group.setY(position.y);
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
        plotters.push(new VarPlot(new VFN(a).p, props));
    }
    console.log(srcModule);
    console.log("module", srcModule.name, "values:", srcModule.values.length, srcModule.values);
}
Plot1D.setRenderer=function(r){
    renderer=r;
}
module.exports=Plot1D;