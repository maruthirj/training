var http = require('http');

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve = serveStatic("./public");

var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});
server.listen(8080);
console.log("Server started");

var WebSocketServer = require('websocket').server;
// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    console.log("Web socket connection...");
    //we'll handle all messages from users here.
    connection.on('message', function(message) {
    	console.log("Web socket message: "+message);
        if (message.type === 'utf8') {
            // process WebSocket message
        	console.log(message.utf8Data);
        	connection.sendUTF("Server response");
        }
    });

    connection.on('close', function(connection) {
        // close user connection
    });
});