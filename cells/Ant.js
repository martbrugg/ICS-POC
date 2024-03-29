var Cell = require('./Cell');
var process = require('process');


/**
 * Demo Componente to Simulate a child of the environment
 * 
 * @class Ant
 * @extends {Cell}
 */
class Ant extends Cell {
    constructor(id, options) {
        super(id, options);
        this.init();

    }
    init() {
        console.log("Ant", this.id, "ready");   
        //this.watchdogInterval = setInterval(this.watchdog.bind(this), 10000);
        this.watchdog();
    }

    watchdog() {
        console.log("Ant", this.id, "I'm alive");
    }

    destructor() {
        //clearInterval(this.watchdogInterval);
        super.destructor();

    }

     
}

module.exports = Ant;