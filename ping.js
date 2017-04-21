var redis = require("redis"),
    config = require("./config/config.js")
    client = redis.createClient(config.db),
    pub = redis.createClient(config.db);
 
// if you'd like to select database 3, instead of 0 (default), call 
// client.select(3, function() { /* ... */ }); 
 
client.on("error", function (err) {
    console.log("Error " + err);
});

client.on("subscribe", function (channel, count) { 
    console.log("subscribe", channel, count);
});

client.subscribe("test");

client.on("message", function (channel, message) { 
    console.log("message", channel, message);
});

setInterval(function(){
    pub.publish("test", "testmessage");
}, 1000);
