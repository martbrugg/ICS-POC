
var transport = require("./transport/eve.js");
var config = require("../config/config");


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
        //Adoption of Options, Id and Parent
        this.options = options;
        this.parent = options.parent;
        this.id = id;
        this.transport = new transport(id);
        this.childs = [];
        this._childPromises = {};

        console.log("Create Cell", id)

        //Subscribe to Messages from Type "remove" and "ready"
        this.on("remove", this.onChildRemoved.bind(this));
        this.on("ready", this.onChildReady.bind(this));
        var self = this;

        //Initialize Transport
        this.transport.ready.then(function () {
            //console.log("transport ready");
            if (self.parent !== undefined) {
                self.sendMessage(self.parent, "ready", {})
                //console.log(self.id, "ready");
                self.ready();
            }
        });
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

    logMessage() {
        this.sendMessage('Manager', 'logMessage', Array.prototype.join.call(arguments, ' '));
    }


    /**
     * Create a new Child Cell
     * 
     * @param {any} name ID of the Cell
     * @param {any} type Type of the Cell
     * @param {any} options 
     * 
     * @memberof Cell
     */
    async createChild(name, type, options) {
        var data = {
            name: name,
            type: type,
            options: options || {}

        }
        var self = this;
        this._childPromises[name] = new Promise(function (resolve, reject) {
            function readyHandler(from, data) {
                //self.off("ready", readyHandler);
                resolve(from);
            }
            self.on("ready", readyHandler);

        })

        data.options.parent = this.id;
        this.sendMessage("Manager", "createCell", data);
        this.childs.push(name);
        return this._childPromises[name];

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
        //console.log("child ready", from);
        //var ref = gun.get(from);
        //gun.get(this.id + '_childs').set(ref);

    }

    ready() {

    }

    /**
     * Destructor of the class
     * 
     * 
     * @memberof Cell
     */
    destructor() {
        console.log(this.id, "desctructor; childs", this.childs)
        for (let i = 0; i < this.childs.length; i++) {
            
            this.sendMessage("Manager", "deleteCell", { name: this.childs[i] });
            console.log("XXX deleteCell", this.childs[i]);
        }
        if (this.parent !== undefined) {
            this.sendMessage(this.parent, "remove", {});
        }
        console.log("remove Object", this.id);
    };
}


module.exports = Cell;