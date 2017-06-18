var Cell = require('./Cell');
var process = require('process');
var StateMachine = require('javascript-state-machine');


/**
 * Demo Component to Simulate an environment
 * 
 * @class Environment
 * @extends {Cell}
 */
class Env extends Cell {
    constructor(id, options) {
        super(id, options);
        this.birdStates = {};
        this.updateCounter = 0;
        this.on("updateStatus", this.onUpdateStatus.bind(this));
        this.fsm = new StateMachine({
            init: 'init',
            transitions: [
                { name: 'initialBirds', from: 'init', to: 'createBird' },
                { name: 'startInteraction', from: 'createBird', to: 'startInteraction' },
                { name: 'calcAverage', from: 'startInteraction', to: 'calcAverage' }
            ],
            methods: {
                onInitialBirds: this.onInitialBirds.bind(this),
                onStartInteraction: this.onStartInteraction.bind(this),
                onCalcAverage: this.onCalcAverage.bind(this)
            }
        })


    }
    init() {
        var self = this;
        console.log("GOL/Env", this.id, "ready");
        /*this.createChilds(2).then(function(d) {
                console.log("childs ready", d);
                self.chooseRandomBirds();
        });*/
        console.log("state", this.fsm.state);
        this.fsm.initialBirds();
        //this.fsm.chooseBird();

    }

    onInitialBirds() {
        console.log('InitialBirds')
        var self = this;
        this.createChilds(2).then(function (d) {
            console.log("childs ready", d);
            var birds = self.chooseRandomBirds();
            self.fsm.startInteraction(birds);
        });

    }

    onToIdle() {
        console.log('ToIdle')
    }


    onStartInteraction(transition, birds) {
        console.log('start Interaction', birds);
        this.updateCounter = 0;
        this.sendMessage(this.childs[birds[0]], "communicate", {partner: this.childs[birds[1]], interacting: true});
        this.sendMessage(this.childs[birds[1]], "communicate", {partner: this.childs[birds[0]], interacting: true});
    }

    onCalcAverage() {
        console.log("onCalcAverage");

    }

    createChilds(n) {
        var test = [];
        for (var i = 0; i < n; i++) {
            let childName = this.id + '_Bird' + i;
            test.push(this.createChild(childName, 'Bird'))
        }

        return Promise.all(test)
    }

    chooseRandomBirds() {
        let finished = false;
        let tmpBirds = [];
        while (!finished) {
            let choosen = Math.floor(Math.random() * this.childs.length);
            if (tmpBirds.indexOf(choosen) === -1) {
                tmpBirds.push(choosen);
            }
            if (tmpBirds.length >= 2) {
                finished = true;
            }
        }
        console.log("birds chosen", tmpBirds);
        return tmpBirds;
    }

    ready() {
        this.init();
    }

    onUpdateStatus(from, data) {
        console.log("updateStatus:", from, data);
        this.birdStates[from] = data;
        if (this.fsm.state === 'startInteraction') {
            this.updateCounter++;
            if (this.updateCounter >= 2) {
                console.log("update finished");
                this.fsm.calcAverage();
            }
        }
    }
    destructor() {
        super.destructor();

    }


}

module.exports = Env;