/**
 * Command processor server
 */
var http = require('http').Server();
var io = require('socket.io')(http);
var cp = require('./CommandProcessor.js');
var sockioClient = require('socket.io-client');
var events = require('./Constants.js').Events;
var consts = require('./Constants.js').Constants;

var PORT = 4000;
if (process.argv[3] !== undefined) {
	PORT = process.argv[3];
}
var cp = new cp.CommandProcessorAsyncE();

function notifyLBServerOfCommandExecution(commandName) {
	// Notify LB server of the command that was just processed
	var clisocket = sockioClient('http://' + consts.lbServerHostPort);
	console.log("Notifying LB server about command: " + commandName);
	clisocket.emit(events.executedCommand, {
		commandName : commandName,
		port : "localhost:"+PORT
	});
}

/**
 * CommandObject structure { name: ls params: ['/Users/maruthir'] }
 */
io.on('connection', function(socket) {
	console.log('a user connected');
	socket.on(events.processCommand, function(commandObject, ackFunction) {
		console.log("process the command: " + commandObject.name);
		// process the command and return result using a return event
		cp.processCommand(commandObject.name, commandObject.params, function(
				err, result) {
			// Send result back to client
			console.log("connected back to command client");
			if (err != null) {
				ackFunction(err);
			} else {
				ackFunction(result);
			}
			notifyLBServerOfCommandExecution(commandObject.name);
		});

	});

	socket.on(events.ping, function(msg, ackFunction) {
		console.log("Responding to ping from lb server");
		// respond to server ping with an ack
		ackFunction();
	});

});

http.listen(PORT, function() {
	console.log('command processing server listening on *:' + PORT);
	// Notify the lb server that this processor is up
	console.log("Connecting to lb server: " + consts.lbServerHostPort);
	var clisocket = sockioClient('http://' + consts.lbServerHostPort);
	clisocket.on('connect', function() {
		console.log("Notifying LB server about coming to life");
		clisocket.emit(events.processorUp, "localhost:" + PORT);
	});
	clisocket.on('error', function(err) {
		throw err;
	});
});
