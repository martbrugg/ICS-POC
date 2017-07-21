var Cell = require('./Cell');
var process = require('process');
var StateMachine = require('javascript-state-machine');
var fs = require("fs");
var csvWriter = require('csv-write-stream');


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
        this.birds = [];
        this.updateCounter = 0;
        this.max = parseInt(options.max || 10);
        this.on("updateStatus", this.onUpdateStatus.bind(this));
        this.fsm = new StateMachine({
            init: 'init',
            transitions: [
                { name: 'initialBirds', from: 'init', to: 'createBird' },
                { name: 'toChooseBirds', from: 'createBird', to: 'chooseBirds' },
                { name: 'toChooseBirds', from: 'calcAverage', to: 'chooseBirds' },
                { name: 'toChooseBirds', from: 'createAdditionalBird', to: 'chooseBirds' },
                { name: 'toResetInteraction', from: 'chooseBirds', to: 'resetInteraction' },
                { name: 'toCalcAverage', from: 'resetInteraction', to: 'calcAverage' },
                { name: 'toCreateAdditionalBird', from: 'calcAverage', to: 'createAdditionalBird' }

            ],
            methods: {
                onInitialBirds: this.onInitialBirds.bind(this),
                onToChooseBirds: this.onChooseBirds.bind(this),
                onToResetInteraction: this.onResetInteraction.bind(this),
                onToCalcAverage: this.onCalcAverage.bind(this),
                onToCreateAdditionalBird: this.onCreateAdditionalBird.bind(this)
            }
        })


    }
    init() {
        var self = this;
        this.count = 0;
        this.log = [];
        this.fsm.initialBirds();
        //this.fsm.chooseBird();

    }

    onInitialBirds() {
        console.log('InitialBirds')
        var self = this;
        self.birds = [];
        this.createChilds(2).then(function (d) {
            console.log("XX childs ready", d);

            console.log("state", self.fsm.state);
            //self.fsm.startInteraction(birds);
            self.fsm.toChooseBirds();

        });
    }

    onCreateAdditionalBird() {
        console.log('create bird')
        var self = this;
        self.birds = [];

        this.createChilds(1).then(function (d) {
            console.log("XX childs ready", d);

            console.log("state", self.fsm.state);
            //self.fsm.startInteraction(birds);
            self.fsm.toChooseBirds();

        });
    }

    onChooseBirds() {
        console.log("chooseBirds");
        //this.logMessage("chooseBirds");
        var self = this;
        self.birds = self.chooseRandomBirds();
        self.updateCounter = 0;
        self.sendMessage(self.childs[self.birds[0]], "communicate", { partner: self.childs[self.birds[1]], interacting: true });
        self.sendMessage(self.childs[self.birds[1]], "communicate", { partner: self.childs[self.birds[0]], interacting: true });

    }

    onToIdle() {
        console.log('ToIdle')
    }


    onResetInteraction() {
        console.log("resetInteraction")
        var self = this;
        //console.log('start Interaction', birds);
        this.updateCounter = 0;
        this.sendMessage(this.childs[self.birds[0]], "communicate", { partner: this.childs[self.birds[1]], interacting: false });
        this.sendMessage(this.childs[self.birds[1]], "communicate", { partner: this.childs[self.birds[0]], interacting: false });
    }

    onCalcAverage() {
        var self = this;
        console.log("onCalcAverage");
        var keys = Object.keys(this.birdStates);
        var sum = 0;
        var error = 0;
        keys.forEach(function (element) {
            let ch = this.birdStates[element]
            //console.log(ch);
            sum += ch.value;
        }, this);
        var avg = (sum / keys.length)
        console.log("avg", avg, "sum", sum);

        keys.forEach(function (element) {
            let ch = this.birdStates[element]
            //console.log(ch);
            error += Math.abs(ch.value - avg);
        }, this);
        console.log("error", error);

        var logEntry = [
            this.count++,
            avg,
            error,
            this.childs.length
        ];

        //this._db[this.id].log.push(logEntry);
        //var log = this.settings.log;
        this.log.push(logEntry);
        //this.settings.log = log;



        var random = Math.random();
        if(this.childs.length > this.max && error < keys.length) {
            console.log(this.max + " Birds Stop Simulation")
            var writer = csvWriter({headers: ["cycle", "avg", "error", "childs"]});
            writer.pipe(fs.createWriteStream('out' + Date.now() + '.csv'))

            this.log.forEach(function (elem) {
                writer.write(elem);
                
            })
            writer.end();
            return;
        }
        if (error < keys.length && random > 0.5) {
            console.log("create new Bird", random);
            setTimeout(function () {
                self.fsm.toCreateAdditionalBird();
            }, 10);


        } else {
            console.log("error to big", error, "random", random);
            setTimeout(function () {
                self.fsm.toChooseBirds();
            }, 10);

        }

    }

    async createChilds(n) {
        var test = [];
        var offset = this.childs.length;
        for (var i = 0; i < n; i++) {
            let childName = this.id + '_Bird' + (offset + i);
            test.push(this.createChild(childName, 'Bird', {size: offset}))
            this.logMessage('create bird', childName);
        }

        return Promise.all(test)
    }

    chooseRandomBirds() {
        let finished = false;
        let tmpBirds = [];
        while (!finished) {
            let rand = Math.random()
            let choosen = Math.floor(rand * this.childs.length);
            if (tmpBirds.indexOf(choosen) === -1) {
                tmpBirds.push(choosen);
            }
            if (tmpBirds.length >= 2) {
                finished = true;
            }
        }
        //console.log("birds chosen", tmpBirds);
        return tmpBirds;
    }

    ready() {
        this.init();
    }

    onUpdateStatus(from, data) {
        //console.log("updateStatus:", from, data);
        this.birdStates[from] = data;
        if (this.fsm.state === 'chooseBirds') {
            this.updateCounter++;
            if (this.updateCounter == 2) {
                console.log("update finished");
                this.fsm.toResetInteraction();
            }
        } else if (this.fsm.state === 'resetInteraction') {
            this.updateCounter++;
            if (this.updateCounter == 2) {
                console.log("update finished");
                this.fsm.toCalcAverage();
            }
        } else {
            console.log("update state");
        }
    }
    destructor() {
        super.destructor();

    }


}

module.exports = Env;