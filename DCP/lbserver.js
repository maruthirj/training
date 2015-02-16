/**
 * Load balancing server
 */
var http = require('http').Server();
var io = require('socket.io')(http);
var events = require('./Constants.js').Events;
var sockioClient = require('socket.io-client');

var commandExecutions = {};
var runningProcessors = {};

io.on('connection', function(socket) {
	console.log('a user connected');
	socket.on(events.decideServer, function(commandName, ackFunction) {
		console.log("Deciding the server to use for command: " + commandName);
		// Find who has executed the least commands and pass the hostname
		var lowestCount = Number.MAX_VALUE;
		var lowestPort = "";
		for(var port in commandExecutions){
			if(commandExecutions[port]<lowestCount){
				lowestCount=commandExecutions[port];
				lowestPort=port;
			}
		}
		ackFunction(lowestPort);
	});

	socket.on(events.executedCommand, function(obj) {
		console.log("Registering a command execution: " + obj.commandName);
		// Register this host name and command executed
		if(commandExecutions[obj.port]===undefined){
			commandExecutions[obj.port]=1;
		}else{
			commandExecutions[obj.port]=commandExecutions[obj.port]+1;
		}
	});

	socket.on(events.processorUp, function(hostPort) {
		console.log("Registering a command processor as being up");
		// Register this host name as being available
		runningProcessors[hostPort] = true;
		commandExecutions[hostPort]=0;
	});
});

http.listen(8000, function() {
	console.log('Load balancing server listening on *:8000');
});

function pingServers() {
	// Ping all alive servers to make sure they are up.
	for (var hostPort in runningProcessors) {
		//runningProcessors[hostPort]=false;
		var clisocket = sockioClient('http://' + hostPort);
		//console.log("Pinging: "+hostPort);
		clisocket.on('connect', function() {
			clisocket.emit(events.ping, "", function(){
				//Ack received
				runningProcessors[hostPort]=true;
			});
			
		});
	}
	setTimeout(pingServers, 5000);
}
setTimeout(pingServers, 5000);
