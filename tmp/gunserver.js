var http = require('http');
var server = require('gun-server')
server({
    handler: function (request, response) {
        // request handler (optional) 
    },
    port: 8080, // default, optional 
    server: new http.Server(), // optional 
    options: {
        // this is passed to the gun constructor 
 
        file: 'data.json' // default 
    }
})