
var redis = require("redis"),
    transport = require("./transport/eve.js")


/**
 * Base Class for a Cell
 * Every further Component is inherited by this cell
 * 
 * @class Cell
 * @param {String} id ID of the Cell
 * @param {Object} options Parameter of the Cell
 */
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


    /**
     * Adding an event handler
     * 
     * @param {any} event Type of the event
     * @callback callback callback Function
     * @param {String} from sender of the message
     * @param {Object} data
     * 
     * @memberof Cell
     */
    on(event, callback) {
        this.transport.on(event, callback)
    }


    /**
     * 
     * 
     * @param {any} event Type of the event
     * @callback callback callback Function
     * @param {String} from sender of the message
     * @param {Object} data
     * 
     * @memberof Cell
     */
    off(event, callback) {
        this.transport.off(event, callback);
    }


    /**
     * Sent a message to another cell
     * 
     * @param {String} rec Receiver of the message
     * @param {String} type Type of the message
     * @param {any} message Content of the Message
     * 
     * @memberof Cell
     */
    sendMessage(rec, type, message) {
        this.transport.sendMessage(rec, type, message);
    };


    /**
     * Create a new Child Cell
     * 
     * @param {any} name ID of the Cell
     * @param {any} type Type of the Cell
     * @param {any} options 
     * 
     * @memberof Cell
     */
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

    /**
     * Is called when a child got removed
     * 
     * @param {any} from Sender of the message
     * @param {any} data child data
     * 
     * @memberof Cell
     */
    onChildRemoved(from, data) {
        var idx = this.childs.indexOf(from);
        if (idx >= 0) {
            this.childs.splice(idx, 1);
        }

    }

    /**
     * Is called when a child is ready
     * 
     * @param {any} from Sender of the message
     * @param {any} data 
     * 
     * @memberof Cell
     */
    onChildReady(from, data) {
        console.log("child ready", from);
    }

    /**
     * Destructor of the class
     * 
     * 
     * @memberof Cell
     */
    destructor() {
        for (let i = 0; i < this.childs.length; i++) {
            this.sendMessage("Manager", "deleteCell", { name: this.childs[i] });
        }
        if (this.parent !== undefined) {
            this.sendMessage(this.parent, "remove", {});
        }
        console.log("remove Object", this.id);
    };
}


module.exports = Cell;