var redis = require("redis"),
    config = require("./config/config.js")
    Cell = require('./Cell.js');
    ReqHandler = require('./ReqHandler');
 
// if you'd like to select database 3, instead of 0 (default), call 
// client.select(3, function() { /* ... */ }); 
 
var c1 = new ReqHandler('C1');
var c2 = new ReqHandler('C2');
console.log("Items initialized");



c1.on('ping', function(sender, data){
    c1.sendMessage(sender, 'pong', 'hello back' + c1.count);
})

c2.on('ping', function(sender, data){
    c2.sendMessage(sender, 'pong', 'hello back'+ c2.count);
})

c1.on('pong', function(sender, data){
    console.log('pong', sender ,data)
})

c2.on('pong', function(sender, data){
    console.log('pong', sender ,data)
})



setInterval(function(){
    c1.sendMessage('C2', 'ping', 'hello' + c1.count)
},2000)


