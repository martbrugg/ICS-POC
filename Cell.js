var redis = require("redis"),
    transport = require("./transport/eve.js")

class Cell {
    constructor(id, options) {
        console.log("Create Cell")
        this.id = id;
        this.transport = new transport(id);
        }

     _onError(err) {
        console.log("Error " + err);
    }

    on(event, callback) {
        this.transport.on(event, callback)
    }

    off(event, callback) {
        this.transport.off(event, callback);
    }

    sendMessage(rec, type, message) {
        this.transport.sendMessage(rec,type,message);
    };
}


module.exports = Cell;