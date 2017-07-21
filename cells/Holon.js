var Cell = require('./Cell');
var process = require('process');
var fs = require("fs");


/**
 * Demo Component to Simulate an environment
 * 
 * @class Holon
 * @extends {Cell}
 */
class Holon extends Cell {
    constructor(id, options) {
        super(id, options);
        this.options.max = this.options.max || 3;
        this.options.level = this.options.level || 0;
        
    }
    init() {

        if(this.options.level < this.options.max) {
            var n = parseInt(Math.random() * 5) + 1;
            this.createChilds(n);
        }
        

    }

    ready() {
        this.init();
    }

    createChilds(n) {
        var test = [];
        var offset = this.childs.length;
        for (var i = 0; i < n; i++) {
            let childName = this.id + '_' + (offset + i);
            test.push(this.createChild(childName, 'Holon', {max: this.options.max, level: this.options.level + 1}))
            this.logMessage('create Holon', childName);
        }

        return Promise.all(test)
    }

   
    destructor() {
        super.destructor();

    }


}

module.exports = Holon;