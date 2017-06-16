var process = require('process');
var Cell = require('./Cell');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



/**
 * Central Managing Component to handle all Cells
 * 
 * @class Manager
 * @extends {Cell}
 */
class Manager extends Cell {
    constructor() {
        super('Manager')
        this.nodes = {}
        this.on("connect", this.connect.bind(this));
        this.on("disconnect", this.disconnect.bind(this));
        this.on("cellCreated", this.onCellsCreated.bind(this));
        this.on("cellDeleted", this.onCellsDeleted.bind(this));
        this.on("createCell", this.onCreateCell.bind(this));
        this.on("deleteCell", this.onDeleteCell.bind(this));
        this.on("error", this.onError.bind(this));
        rl.question('Enter command: ', _onInput.bind(this));

    }


    /**
     * Callback if a WorkerNode connects 
     * 
     * @param {any} from Name of the Worker
     * @param {any} data
     * 
     * @memberof Manager
     */
    connect(from, data) {
        console.log("connect", from, data);
        if (this.nodes[from] === undefined) {
            this.nodes[from] = data;
            this.nodes[from].cells = this.nodes[from].cells || [];
        }
    }
    /**
     * Callback if a WorkerNode disconnects 
     * 
     * @param {any} from Name of the Worker
     * @param {any} data
     * 
     * @memberof Manager
     */
    disconnect(from, data) {
        console.log("disconnect", from, data);
        delete this.nodes[from];

    }

    /**
     * Callback if a new Cell should be created
     * 
     * @param {any} from Name of the Sender
     * @param {any} data
     * 
     * @memberof Manager
     */
    onCellsCreated(from, data) {
        this.nodes[from].cells = data;
    }

    /**
     * Callback if a cell should be deleted
     * 
     * @param {any} from Name of the Sender
     * @param {any} data
     * 
     * @memberof Manager
     */
    onCellsDeleted(from, data) {
        if (this.nodes[from] !== undefined) {
            this.nodes[from].cells = data;
        }

    }

    /**
     * Callback if an error occoured
     * 
     * @param {any} from Name of the Sender
     * @param {any} msg Error message
     * 
     * @memberof Manager
     */

    onError(from, msg) {
        console.log("Error from:", from, ';', msg);
    }


    /**
     * Function to list all Cells in the Terminal
     * 
     * 
     * @memberof Manager
     */
    listCells() {
        console.log("list cells")
        for (let nodeId in this.nodes) {
            console.log("node:", nodeId, "cells:");
            this.nodes[nodeId].cells.forEach(function(element, index) {
                console.log(index,':',element);
            }, this);
            console.log('------------------------------------');
            
        }
    }

    onCreateCell(from, data) {
        var nodeKeys = Object.keys(this.nodes);
        var nodeIndex = parseInt(Math.random() * nodeKeys.length)
        var selNode = nodeKeys[nodeIndex];
        console.log("create cell", data.name)
        this.sendMessage(selNode, "createCell", data);
        

    }

    createCell(cmd) {
        var data = {
            name: cmd[1],
            type: cmd[2]
        }

        var options = this.parseOptions(cmd);
        //this.onCreateCell("Manager", data);
        this.createChild(data.name, data.type, options);
    }

    parseOptions(cmd) {
        var options = {};
        for(var i=3; i<cmd.length; i++) {
            let opt = cmd[i].split('=');
            if(opt.length === 2) {
                options[opt[0]] = opt[1];
            }
        }

        return options;
    }


    /**
     * Handler if a cell is deleted
     * 
     * @param {any} from 
     * @param {any} data 
     * 
     * @memberof Manager
     */
    onDeleteCell(from, data) {
        var selNode;
        console.log("delete cell", data.name)
        var nodeKeys = Object.keys(this.nodes);
        for (let nodeId in this.nodes) {

            var cell = this.nodes[nodeId].cells.find(function (el, index) {
                return el.name === data.name;
            })
            if (cell !== undefined) {
                selNode = nodeId;
                break;
            }
        }

        if (selNode !== undefined) {
            this.sendMessage(selNode, 'deleteCell', data.name);
        }
    }

    deleteCell(cmd) {
        var data = {
            name: cmd[1]
        }
        this.onDeleteCell("Manager", data);
    }


}

function _onInput(text) {
    var self = this;
    console.log('text:', text);
    var command = text.split(' ');
    switch (command[0]) {
        case 'list':
            this.listCells()
            break;

        case 'create':
            this.createCell(command);

            break;

        case 'delete':
            this.deleteCell(command);
            break;
    }
    setTimeout(function () {
        rl.question('Enter command: ', _onInput.bind(self));
    }, 1000)

}

var manager = new Manager();