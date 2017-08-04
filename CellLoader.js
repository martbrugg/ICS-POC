
//Listen to Messages from the parent process (Worker)
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

//create new cell component
createCell = function (data) {
    if (data.type !== undefined) {
        //load module
        ClassType = require('./cells/' + data.type);
        //create instance
        instance = new ClassType(data.name, data.options);
        //notify parentprocess (Worker) when component is ready
        process.send({success: true});
    }

}

// delecte component
deleteCell = function() {
    //call destructor
    instance.destructor();

    //delete instance and exit process
    setTimeout(function(){
        delete instance;
        process.exit();
    },1000);
    
}

process.send('Hello from Process');
