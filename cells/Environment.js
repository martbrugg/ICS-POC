var Cell = require('./Cell');
var process = require('process');


/**
 * Demo Component to Simulate an environment
 * 
 * @class Environment
 * @extends {Cell}
 */
class Environment extends Cell {
    constructor(id, options) {
        super(id, options);
        this.init();
        

    }
    init() {
        console.log("Environment", this.id, "ready");   
        this.watchdogInterval = setInterval(this.watchdog.bind(this), 10000);
        this.watchdog();
        setTimeout(this.createChilds.bind(this), 500);
        

    }

    createChilds() {
        for(var i=0; i<2; i++) {
            let childName = this.id + '_Ant' + i;
            this.createChild(childName, 'Ant');
        }
    }

    watchdog() {
        console.log(this.id, "I'm alive");
    }

    destructor() {
        clearInterval(this.watchdogInterval);
        super.destructor();

    }

     
}

module.exports = Environment;