var r = require('rethinkdb');
var connection = null;
var connReady = r.connect({ host: 'localhost', port: 28015 }).then(function (conn) {
    connection = conn;
    console.log("db Connection Ready");
});

class Parameter {

    
    constructor(name, parent) {
        var self = this;
        this.name = name;
        this.parent = parent;
        r.table('ICS').insert({name: name}).run(connection)
        .then(function(value) {
            //self.key = value.
            console.log("value", value);
        })
    }

    set() {
        
    }

    static ready() {
        return connReady;
    }
}






module.exports = Parameter;
