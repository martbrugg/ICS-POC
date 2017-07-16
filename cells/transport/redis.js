var redis = require("redis"),
    config = require("../config/config.js")

class RedisTransport {
    constructor(id, options) {
        console.log("Create Redis Transport Plugin")
        this.id = id;
        this._events = {};
        this._client = {};
        this._client.pub = redis.createClient(config.db);
        this._client.sub = redis.createClient(config.db);
        this._client.sub.on("message", this._processMessage.bind(this));
        this._client.sub.on("error", this._onError);
        this._client.pub.on("error", this._onError);

    }

     _onError(err) {
        console.log("Error " + err);
    }

    on(event, callback) {
        if (this._events[event] === undefined) {
            this._events[event] = [];
            var topic = this.id + "." + event
            this._client.sub.subscribe(topic);
            console.log(this.id, "subscribe to", topic)
        }

        this._events[event].push(callback);
    }

    off(event, callback) {
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

    sendMessage(rec, type, message) {
        var data = {
            sender: this.id,
            message: message
        };
        var d = JSON.stringify(data);
        var topic = rec + "." + type;
        console.log(this.id, "publish to", topic , message)
        this._client.pub.publish(topic, d);
    };

    _processMessage(channel, message) {
        var data = JSON.parse(message);
        console.log("receive Message", channel, data);
        var event = channel.split(".")[1];

        if (this._events[event] !== undefined) {
            var callbacks = this._events[event];
            for (var i = 0; i < callbacks.length; i++) {
                var callback = callbacks[i];
                callback.call(this,data.sender, data.message);
                //callback(data.sender, data.message);
            }
        }

    }
}


module.exports = RedisTransport;