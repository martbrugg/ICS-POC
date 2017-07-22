process.on('message', (msg) => {
    console.log('Message from parent:', msg);
    switch (msg.cmd) {
        case "create":
            createCell(msg);
            break;

        case "delete":
            deleteCell(msg);
            break;

        default:
            break;
    }
});
var instance;

createCell = function (data) {
    if (data.type !== undefined) {
        ClassType = require('./cells/' + data.type);
        instance = new ClassType(data.name, data.options);
        process.send({success: true});
    }

}

deleteCell = function() {
    instance.destructor();
    setTimeout(function(){
        delete instance;
        process.exit();
    },1000);
    
}

process.send('Hello from Process');
