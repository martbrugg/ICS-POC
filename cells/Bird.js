var Cell = require('./Cell');
var process = require('process');


/**
 * Demo Component to Simulate an environment
 * 
 * @class Environment
 * @extends {Cell}
 */
class Life extends Cell {
    constructor(id, options) {
        super(id, options);
        
        this.interacting = false;
        options.size = Math.max(options.size, 1);
        this.value = Math.random() * 1000 * options.size;
        this.on("communicate", this.onCommunicate.bind(this));
        this.on("exchange", this.onExchange.bind(this));
        this.init();
        this.settings.a = "test"
        console.log(this.settings.a);
        

    }
    init() {
        //console.log("GOL/Life", this.id, "ready");   
        this.updateStatus();
    }


    onCommunicate(from, data) {

        if(data.interacting === true) {
            this.interacting = true;
            this.sendMessage(data.partner, "exchange", this.value);
        } else {
            this.interacting = false;
            this.value = this.newValue;
            this.updateStatus();
        }     
        
        
    }

    updateStatus() {
        this.sendMessage(this.parent, "updateStatus", {
            interacting: this.interacting,
            value: this.value,
            newValue: this.newValue
        });
    }

    onExchange(from, data) {
        this.newValue = (this.value + data) / 2;
        this.updateStatus();

    }

    destructor() {
        super.destructor();

    }

     
}

module.exports = Life;