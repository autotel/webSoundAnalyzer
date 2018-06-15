console.log("hui");
const Konva=require('Konva');
const FFT=require('./processes/FFT.js');
const MicrophoneInputProcess=require('./processes/MicrophoneInput.js');
const ProcessBase=require('./processes/ProcessBase.js');

var renderer=new(function(){
    var self=this;
    var stage = new Konva.Stage({
        container: 'konva',
        width: 1024,
        height: 1024
    });
    this.layer=new Konva.Layer();
    stage.add(self.layer);
    this.animQueue=[];
    var anim = new Konva.Animation(function(frame) {
        for(var a of self.animQueue) a(frame);
    }, stage);

    anim.start();
    return this;
})();
function ModulePlot(srcModule,props){
    var colors=['red','green','blue','cyan','magenta','yellow'];
    var colorn=0;
    function Plot1D(valFn,props){
        var position=props.position||{x:0,y:0}
        var size=props.size||{x:0,y:0}
        var group=new Konva.Group();
        var plotLine=new Konva.Line({
            points: [0,0],
            stroke: colors[colorn],
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round'
        });
        console.log(colorn);
        colorn++;
        var xMaxText=new Konva.Text({
            text:'0',align:'right'});
        var xMinText=new Konva.Text({text:'0'});
        var yMaxText=new Konva.Text({text:'0'});
        var yMinText=new Konva.Text({text:'0'});
        yMinText.offsetY(18);
        xMaxText.offsetY(18);
        group.add(plotLine);
        group.add(xMaxText);
        group.add(xMinText);
        group.add(yMaxText);
        group.add(yMinText);
        renderer.layer.add(group);
        
        var highestValue=0;
        var lowestValue=0;
        
        this.replot=function(){
            var raw=valFn();
            
            // console.log("data",raw);
            if(!raw){
                console.warn("plot values is",raw); return false;
            }
            var dataset=Array.from(raw);
            
            dataset.map(function(a){
                if(a>highestValue){ 
                    highestValue=a; console.log("new hi", highestValue);
                }
                if(a<lowestValue){ 
                    lowestValue=a; console.log("new lo", lowestValue);
                }
            });
            
            var normalizeValue=1/(highestValue-lowestValue);
            
            var heightNormalizeValue=size.y/(highestValue-lowestValue);
            var plotPoints=[];
            var stepWidthPx=size.x/dataset.length
            for(var n in dataset){
                //x pos
                plotPoints.push(stepWidthPx*n);
                //ypos
                plotPoints.push(size.y-((dataset[n]-lowestValue)*heightNormalizeValue));
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
    var plotters=[];
    this.replot=function(){
        for(var a in plotters){
            // console.log("REP",a);
            plotters[a].replot();
        }

    }
    var VFN=function(n){
        this.p=function () {
            // console.log("P",a);
            // console.log(srcModule.values[a]);
            return srcModule.values[n];
        }
    };
    for(var a in srcModule.values){
        plotters.push(new Plot1D(new VFN(a).p,props));
    }
    console.log(srcModule);
    console.log("module",srcModule.name,"values:",srcModule.values.length,srcModule.values);
}

var handleSuccess = function(stream) {
    var global={}

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    

    global.audioContext=audioCtx;
    
    var input=new MicrophoneInputProcess(global,stream);

    var direct1=new ProcessBase(global);
    var direct2=new ProcessBase(global);
    var fft=new FFT(global);

    input.connectTo(fft);
    fft.connectTo(direct1,0);
    fft.connectTo(direct2,1);

    var plot2=new ModulePlot(input,{size:{x:500,y:200},position:{x:0,y:0}});
    var plot1=new ModulePlot(fft,{size:{x:500,y:200},position:{x:0,y:200}});

    renderer.animQueue.push(plot1.replot);
    renderer.animQueue.push(plot2.replot);
};

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.');
    navigator.mediaDevices.getUserMedia (
       // constraints - only audio needed for this app
       {
          audio: true
       })
 
       // Success callback
       .then(handleSuccess)
 
       // Error callback
       .catch(function(err) {
          console.log('The following getUserMedia error occured: ' );
          console.error(err);
       }
    );
 } else {
    console.log('getUserMedia not supported on your browser!');
 }