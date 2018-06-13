console.log("hui");
const Konva=require('Konva');

var renderer=new(function(){
    var self=this;
    var stage = new Konva.Stage({
        container: 'konva',
        width: 1024,
        height: 768
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

function Plot1D(datasetfn,size,position={x:0,y:0}){
    var group=new Konva.Group();
    var plotLine=new Konva.Line({
        points: [0,0],
        stroke: 'black',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round'
    });
    var xMaxText=new Konva.Text({text:'0'});
    var xMinText=new Konva.Text({text:'0'});
    var yMaxText=new Konva.Text({text:'0'});
    var yMinText=new Konva.Text({text:'0'});
    group.add(plotLine);
    group.add(xMaxText);
    group.add(xMinText);
    group.add(yMaxText);
    group.add(yMinText);
    renderer.layer.add(group);
    
    var highestValue=1;
    var lowestValue=0;

    this.replot=function(){
        var raw=datasetfn();
        // console.log("data",raw);
        if(!raw)return false;
        var dataset=Array.from(raw);
        
        dataset.map(function(a){
            if(a>highestValue) highestValue=a
            if(a<lowestValue) lowestValue=a
        });
        
        var normalizeValue=1/(highestValue-lowestValue);
        
        var heightNormalizeValue=size.y/highestValue;
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



var handleSuccess = function(stream) {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var source = audioCtx.createMediaStreamSource(stream);
    //for custom processors
    // var processor = audioCtx.createScriptProcessor(1024, 1, 1);
    // source.connect(processor);
    // processor.connect(audioCtx.destination);
    // processor.onaudioprocess = function(e) {
    //     // Do something with the data, i.e Convert this to WAV
    //     // console.log(e.inputBuffer);
    
    //     // const input = e.inputBuffer
    //     s.appendData(e.inputBuffer);
    //     s.recompute();
    //     plot.replot();
    // };
   
    var analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    var plot1=new Plot1D(function(){
        var dataArray = new Uint8Array(analyser.frequencyBinCount);
        // console.log(analyser.getByteTimeDomainData(dataArray));/
        analyser.getByteFrequencyData(dataArray)
        return dataArray;
    },{x:500,y:200});

    var plot2=new Plot1D(function(){
        var dataArray = new Uint8Array(analyser.frequencyBinCount);
        // console.log(analyser.getByteTimeDomainData(dataArray));/
        analyser.getByteTimeDomainData(dataArray)
        return dataArray;
    },{x:500,y:200},{x:0,y:210});



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