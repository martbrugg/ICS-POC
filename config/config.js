var eve = require("evejs");
var db = {
    host: "127.0.0.1",
    port: 6379
}

var transports = [
    {
        type: 'amqp',
        id: 'myamql',
        //url: 'amqp://gacxbcgi:FgCD9fkxYokVEkVtyQKD0FLF-akG_HQe@penguin.rmq.cloudamqp.com/gacxbcgi',
        url: 'amqp://localhost:5672'

    }
];


exports.db = db;
exports.transports = transports;