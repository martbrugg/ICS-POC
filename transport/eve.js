var eve = require("evejs"),
    config = require("../config/config.js")

eve.system.init({
    transports: config.transports
})

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

EveAgentTransport.prototype.on = function(event, callback) {
    if (this._events[event] === undefined) {
        this._events[event] = [];
        var topic = this.id + "." + event
        //console.log(this.id, "subscribe to", topic)
    }

    this._events[event].push(callback);
}

EveAgentTransport.prototype.off = function(event, callback) {
    if (this._events[event] !== undefined) {
        var idx = this._events[event].indexOf(callback);
        if (idx >= 0) {
            this._events[event].splice(idx, 1);
        }
        if (this._events[event].length = 0) {
            delete this._events[event];
            client.sub.unsubscribe(this.id + "." + event);
        }

    }
}

EveAgentTransport.prototype.sendMessage = function(rec, type, message) {
    var data = {
        sender: this.id,
        message: message,
        event: type
    };
    var d = JSON.stringify(data);
    var topic = rec + "." + type;
    this.send(rec,d);
    //console.log(this.id, "publish to", topic, message)
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
                console.log("Error executing message Handler")
            }
            
            //callback(data.sender, data.message);
        }
    }

}


module.exports = EveAgentTransport;