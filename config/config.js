var eve = require("evejs");
var process = require("process")
var db = {
    host: "127.0.0.1",
    port: 6379
}

var transports = [
    {
        type: 'amqp',
        id: 'myamql',
        //url: 'amqp://gacxbcgi:FgCD9fkxYokVEkVtyQKD0FLF-akG_HQe@penguin.rmq.cloudamqp.com/gacxbcgi',
        url: process.env.AMQP_HOST || 'amqp://localhost:5672'

    }
];

console.log("transport", transports);
//console.log("env", process.env);


exports.db = db;
exports.transports = transports;