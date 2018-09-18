var Observable=require('onhandlers');
var ProcessBase = require('./ProcessBase.js');
var Average = require('./Average.js');
var TransientFinder1D = function (global, props) {
    ProcessBase.call(this, global);
    Observable.call(this);
    var self = this;
    var average = new Average(global, { length: 3 });
    this.name = "TransientFinder";

    if (!props) props = {};
    if (props.attack === undefined) props.attack = 1;
    if (props.decay === undefined) props.decay = 1;

    var minIntensity = 0.00004;
    var intensityAdjustMultiplier = 0.99;
    var tresh = minIntensity;

    this.addOutputChannel(1);
    this.addOutputChannel(2);
    this.addOutputChannel(3);
    this.addOutputChannel(4);

    var envelopeState = {
        attack: false,
        decay: false,
        level: 0,
        trigLevel: 0,
    }

    this.receive = function (input) {
        average.receive(input);
        self.values[3] = average.values[0];
        var slope = 0;
        // if(tresh>minIntensity){
        //     tresh*=intensityAdjustMultiplier;
        // }
        // console.log(self.values[2]);
        if (self.values[3].length >= 2) {
            slope = self.values[3][1] - self.values[3][0];
            self.values[2].unshift(slope);
            var thisIntensity = Math.abs(slope);
            if (thisIntensity > tresh) {
                // tresh+=thisIntensity*(1/intensityAdjustMultiplier);
                // console.log("TRANSIENT",slope);
                self.values[1].unshift(thisIntensity);

                if (thisIntensity > envelopeState.level) {
                    envelopeState.attack = 0;
                    // console.log("Attack");
                    self.handle("attack",envelopeState);
                    self.handle("envelope",envelopeState);
                    envelopeState.trigLevel = thisIntensity;
                }


            } else {
                self.values[1].unshift(0);
            }
        }

        if (envelopeState.attack !== false) {
            var envProgress = envelopeState.attack / props.attack;
            if (envelopeState.decay) envProgress += envelopeState.decay / props.decay;
            if (props.exponential) envProgress = Math.pow(envProgress);
            
            envelopeState.level = envProgress * envelopeState.trigLevel;
            envelopeState.attack++;
            if (envelopeState.attack >= props.attack) {
                envelopeState.attack = false;
                envelopeState.decay = props.decay;
                // console.log("Decay
                self.handle("decay", envelopeState);
                self.handle("envelope",envelopeState);

            }
            // self.values[3].unshift(minIntensity);
        } else if (envelopeState.decay !== false) {

            var envProgress = Math.sqrt(envelopeState.decay / props.decay);
            if(props.exponential) envProgress=Math.sqrt(envProgress);
            envelopeState.level = envProgress * envelopeState.trigLevel;

            // console.log("Decay", envelopeState.decay, envProgress, envelopeState.level);

            envelopeState.decay--;
            if (envelopeState.decay <= 0) {
                envelopeState.decay = false;
                envelopeState.trigLevel = 0;
                envelopeState.level = 0;
                self.handle("off", envelopeState);
                self.handle("envelope",envelopeState);

            }
            // self.values[3].unshift(minIntensity);
        }
        self.values[0].unshift(envelopeState.level);

        while (self.values[0].length > input.length) self.values[0].pop();
        while (self.values[1].length > input.length) self.values[1].pop();
        while (self.values[2].length > input.length) self.values[2].pop();
        while (self.values[4].length > input.length) self.values[4].pop();

        self.output(self.values[0], 0);
        self.output(self.values[1], 1);
        self.output(self.values[2], 2);
        self.output(self.values[3], 3);
        self.output(self.values[4], 4);

    }
}
module.exports = TransientFinder1D;