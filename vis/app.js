var app = {
  init: function () {
    console.log("app init");
    app.ws = new WebSocket('ws://localhost:8080');
    app.ws.onopen = function () {
      console.log("connection open")
    }

    app.ws.onmessage = app.onmessage;
    //app.createNetwork();

  },

  onmessage: function (e) {
    console.log("new Message");
    var msg = JSON.parse(e.data);
    console.log(msg);
    switch (msg.type) {
      case "nodes":
        app.createWorkerNetwork(msg.data);
        app.createCellNetwork(msg.data);

        break;

      default:
        break;
    }
  },

  createWorkerNetwork(data) {
    var worker = Object.keys(data);
    var nodes = [{
      id: 'Manager', label: 'Manager'
    }];
    var edges = [];

    for (var i = 0; i < worker.length; i++) {
      nodes.push({
        id: worker[i],
        label: worker[i]
      })
      edges.push({ from: 'Manager', to: worker[i] })
    }

    var container = document.getElementById('workernetwork');

    // provide the data in the vis format
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {
      layout: {
        hierarchical: {
          direction: 'UD'
        }
      }
    };

    // initialize your network!
    var network = new vis.Network(container, data, options);

  },

  createCellNetwork(data) {
    var worker = Object.keys(data);
    var nodes = [
      //{ id: 'Manager', label: 'Manager', group: "Manager"}
    ];
    var edges = [];
    var groups = {};

    for (var i = 0; i < worker.length; i++) {
      var cells = data[worker[i]].cells;

      for (var j = 0; j < cells.length; j++) {
        nodes.push({
          id: cells[j].name,
          label: cells[j].name,
          group: cells[j].type
        })
        edges.push({ from: cells[j].options.parent, to: cells[j].name })
        /*if (groups[cells[j].type] === undefined) {
          groups[cells[j].type] = {
            color: { background: randomColor() }
          }
        }*/
      }


    }

    var container = document.getElementById('cellnetwork');

    // provide the data in the vis format
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {
      nodes: {
        shape: 'dot',
        size: 30,
        font: {
          size: 12,
          color: '#000000'
        },
        borderWidth: 2
      },
      edges: {
        width: 2
      },
      groups: groups,
      layout: {
        /*hierarchical: {
          //direction: 'UD'
        }*/
      }
    };

    // initialize your network!
    var network = new vis.Network(container, data, options);

  },


}


