var eve = require("evejs"),
    config = require("../../config/config.js")

eve.system.init({
    transports: config.transports
})



/**
 * Agent Adapter to use Eve Agent Framework as Base Class
 * 
 * @param {any} id 
 * @param {any} options 
 */
EveAgentTransport = function (id, options) {
    eve.Agent.call(this, id);
    console.log("Create Eve Transport Plugin")
    this.id = id;
    this._events = {};
    this.extend('request');
    this.connect(eve.system.transports.getAll());
}
EveAgentTransport.prototype = Object.create(eve.Agent.prototype);
EveAgentTransport.prototype.constructor = EveAgentTransport;


/**
 * Add Event Listener
 * 
 * @param {any} event 
 * @callback callback 
 */
EveAgentTransport.prototype.on = function(event, callback) {

    if (this._events[event] === undefined) {
        this._events[event] = [];
        var topic = this.id + "." + event
        //console.log(this.id, "subscribe to", topic)
    }

    this._events[event].push(callback);
}

/**
 * Remove EventListener
 * 
 * @param {any} event 
 * @callback callback 
 */
EveAgentTransport.prototype.off = function(event, callback) {
    if (this._events[event] !== undefined) {
        var idx = this._events[event].indexOf(callback);
        if (idx >= 0) {
            this._events[event].splice(idx, 1);
        }
        if (this._events[event].length = 0) {
            delete this._events[event];
        }

    }
}


/**
 * send message via Eve Agent Framework
 * 
 * @param {any} rec 
 * @param {any} type 
 * @param {any} message 
 */
EveAgentTransport.prototype.sendMessage = function(rec, type, message) {
    var data = {
        sender: this.id,
        message: message,
        event: type
    };
    var d = JSON.stringify(data);
    var topic = rec + "." + type;
    console.log(this.id, "publish to", rec, data.event);
    this.send(rec,d);
    
};

function _onError(err) {
    console.log("Error " + err);
}



EveAgentTransport.prototype.receive = function(from, message) {
    var data = JSON.parse(message);
    //console.log("receive Message", from, data);
    var event = data.event;

    if (this._events[event] !== undefined) {
        var callbacks = this._events[event];
        for (var i = 0; i < callbacks.length; i++) {
            try {
                var callback = callbacks[i];
                callback.call(this, from, data.message);
            } catch (error) {
                console.log("Error executing message Handler", error);
            }
            //var callback = callbacks[i];
            //callback(data.sender, data.message);
        }
    }

}


module.exports = EveAgentTransport;