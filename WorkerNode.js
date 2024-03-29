var Cell = require('./cells/Cell');
var process = require('process');
const fs = require('fs');
const child_process = require('child-process-debug');


/**
 * Managing Component for a worker node
 * 
 * @class WorkerNode
 * @extends {Cell}
 */
class WorkerNode extends Cell {
    constructor(id) {
        super(id);
        this.cells = []
        this.instances = [];
        this.init();
        this.on("createCell", this.createCell.bind(this));
        this.on("deleteCell", this.deleteCell.bind(this));

    }


    /**
     * initialization of the WorkerNode 
     * 
     * 
     * @memberof WorkerNode
     */
    init() {
        var data = {
            id: this.id
        }
        var self = this;
        setTimeout(function () {
            self.sendMessage("Manager", "connect", data)

        }, 1000);
    }

    disconnect() {
        this.sendMessage("Manager", "disconnect")
    }


    /**
     * Create a new Cell on the node
     * 
     * @param {any} from 
     * @param {any} data 
     * 
     * @memberof WorkerNode
     */
    createCell(from, data) {
        var ClassType;
        var item = {};
        console.log("create cell from:", from, "data:", data)

        if (data.type !== undefined) {
            ClassType = require('./cells/' + data.type);
        }

        //Check if Type is available
        if (ClassType !== undefined) {
            //Creation of child process
            var ch_proc = child_process.fork("CellLoader.js");
            //Saving of of the reference
            item = {
                name: data.name,
                type: data.type,
                proc: ch_proc
            }
            var self = this

            //Messaging interface to communicate with the childprocess
            ch_proc.on('message', function (msg) {
                console.log('Message from child', msg);
                //Component ready
                if(msg.success === true) {
                    console.log('created')
                    //save refernces
                    self.cells.push(data)
                    self.instances.push(item);
                    //notify Manager of successfull creation
                    self.sendMessage("Manager", "cellCreated", self.cells)
                }
            })

            //send message to initialize the component with parameters id, type and options
            ch_proc.send({ cmd: 'create', name: data.name, type: data.type, options: data.options });
        }

        else {
            //send Errormessage to Manager
            this.sendMessage("Manager", "error", "Error createing node")
        }





    }


    /**
     * Delete an existing Cell on the node 
     * 
     * @param {any} from 
     * @param {any} data 
     * 
     * @memberof WorkerNode
     */
    deleteCell(from, data) {
        console.log("delete cell from:", from, "data:", data)
        this.cells = this.cells.filter(function (el, index) {
            return el.name !== data
        })

        for (let i = 0; i < this.instances.length; i++) {
            if (this.instances[i].name === data) {
                //this.instances[i].instance.destructor();
                //delete this.instances[i].instance;
                this.instances[i].proc.send({ cmd: 'delete'});
                //this.instances[i].instance = undefined;
                this.instances.splice(i, 1);
            }
        }
        this.sendMessage("Manager", "cellDeleted", this.cells)
    }


}
var args = process.argv

var workerId = process.env.WORKER_ID || "TestWorker";


if (args.length > 2) {
    workerId = args[2];
}
var myNode = new WorkerNode(workerId)

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    myNode.disconnect();
    setTimeout(function() {
        process.exit();
    },500);
    
});