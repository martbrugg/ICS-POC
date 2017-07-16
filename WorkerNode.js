var Cell = require('./cells/Cell');
var process = require('process');


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
        console.log("create cell from:", from, "data:", data )
        
        if(data.type !== undefined) {
            ClassType = require('./cells/' + data.type);
        }
        if(ClassType !== undefined) {
            item = {
                name: data.name,
                type: data.type,
                instance: new ClassType(data.name, data.options)
            }
            this.cells.push(data)
            this.instances.push(item);
            this.sendMessage("Manager", "cellCreated", this.cells)
        }

        else {
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
        console.log("delete cell from:", from, "data:", data )
        this.cells = this.cells.filter(function(el, index) {
            return el.name !== data
        })

        for(let i=0; i<this.instances.length; i++) {
            if(this.instances[i].name === data) {
                this.instances[i].instance.destructor();
                delete this.instances[i].instance;
                this.instances[i].instance = undefined;
                this.instances.splice(i,1);
            }
        }
        this.sendMessage("Manager", "cellDeleted", this.cells)
    }

     
}
var args = process.argv

var workerId = "TestWorker"

if(args.length > 2) {
    workerId = args[2];
}
var myNode = new WorkerNode(workerId)