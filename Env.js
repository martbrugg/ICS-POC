var Cell = require('./Cell');
var process = require('process');


/**
 * Demo Component to Simulate an environment
 * 
 * @class Environment
 * @extends {Cell}
 */
class Env extends Cell {
    constructor(id, options) {
        super(id, options);
        this.on("updateStatus", this.onUpdateStatus.bind(this));
    }
    init() {
        console.log("GOL/Env", this.id, "ready"); 
        this.createChilds();  
    }

    createChilds() {
        var test = [];
        for(var i=0; i<2; i++) {
            let childName = this.id + '_Bird' + i;
            test.push(this.createChild(childName, 'Bird'))
        }

        Promise.all(test).then(function(d) {
                console.log("childs ready", d);
        });
    }

    ready() {
        this.init();
    }

    onUpdateStatus(from, data) {
        console.log("updateStatus:", from, data);
    }
    destructor() {
        super.destructor();

    }

     
}

module.exports = Env;