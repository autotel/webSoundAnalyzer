const Konva = require('Konva');
const Plot1D = require('./Plot1D');
const PlotCoords = require('./PlotCoords');
var renderer = new (function () {
    var self = this;
    var stage = new Konva.Stage({
        container: 'konva',
        width: 1024,
        height: 2048
    });
    this.layer = new Konva.Layer();
    stage.add(self.layer);
    this.animQueue = [];
    var anim = new Konva.Animation(function (frame) {
        for (var a of self.animQueue) a(frame);
    }, stage);

    anim.start();

    this.Plot1D = Plot1D;
    Plot1D.setRenderer(this); 
    this.PlotCoords = PlotCoords;
    PlotCoords.setRenderer(this);

    return this;
})();
module.exports = renderer;