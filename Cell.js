var redis = require("redis"),
    transport = require("./transport/eve.js")

class Cell {
    constructor(id, options) {
        options = options || {};
        this.options = options;
        this.parent = options.parent;
        console.log("Create Cell")
        this.id = id;
        this.transport = new transport(id);
        this.childs = [];
        if (this.parent !== undefined) {
            this.sendMessage(this.parent, "ready", {})
        }

        this.on("remove", this.onChildRemoved.bind(this));
        this.on("ready", this.onChildReady.bind(this));
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
        this.transport.sendMessage(rec, type, message);
    };

    createChild(name, type, options) {
        var data = {
            name: name,
            type: type,
            options: options || {}

        }
        data.options.parent = this.id;
        this.sendMessage("Manager", "createCell", data);
        this.childs.push(name);
        
    }

    onChildRemoved(from, data) {
        var idx = this.childs.indexOf(from);
        if(idx >= 0) {
            this.childs.splice(idx,1);
        }
        
    }

    onChildReady(from, data) {
        console.log("child ready", from);
    }

    destructor() {
        for(let i=0; i<this.childs.length; i++) {
            this.sendMessage("Manager", "deleteCell", {name: this.childs[i]});
        }
        if(this.parent !== undefined) {
            this.sendMessage(this.parent, "remove", {});
        }
        console.log("remove Object", this.id);
    };
}


module.exports = Cell;