/**
 * Load balancing server
 */
var http = require('http').Server();
var io = require('socket.io')(http);
var events = require('./Constants.js').Events;
var sockioClient = require('socket.io-client');
var Bacon = require('baconjs');


var connectionsStream = Bacon.fromBinder(function(sink) {
	io.on('connection', sink);
});

var decideServerStream = connectionsStream.flatMap(function(socket) {
	return Bacon.fromBinder(function(sink) {
		socket.on(events.decideServer, function(commandName, ackFunction) {
			sink({
				client : socket,
				commandName : commandName,
				ackFunction: ackFunction
			});
		});
	});
});

var processorUpStream = connectionsStream.flatMap(function(socket) {
	return Bacon.fromBinder(function(sink) {
		socket.on(events.processorUp, function(hostPort) {
			sink(hostPort);
		});
	});
});
var executeCommandStream = connectionsStream.flatMap(function(socket) {
	return Bacon.fromBinder(function(sink) {
		socket.on(events.executedCommand, function(obj) {
			sink(obj);
		});
	});
});


executeCommandStream.onValue(function(obj){
	console.log("Command execution stream %j",obj)
})
//scan is like a reduce function
var runningProcessors = processorUpStream.scan({},function(acc,hostPort){
	console.log("Updating runningProcessors: "+hostPort);
	acc[hostPort] = true;
	return acc;
});

/*
 * CommandExecutions is a property of this form
 * port vs no of command executions on that port
 * (A port represents a command processor instance)
 * {
 * 	2000:3,
 * 	3000:1
 * }
 */
var commandExecutions = processorUpStream.merge(executeCommandStream).scan({},function(acc,obj){
	console.log("Updating commandExecutions: "+obj);
	if(typeof obj==='string'){
		acc[obj]=0;//New running process
	}else{
		//Command executions
		acc[obj.port]=acc[obj.port]+1;
	}
	return acc;
});


var decisionProperty = decideServerStream.combine(commandExecutions, function(decideObj,cmdExecutions){
	console.log("combining decideServer event with current commandExecution value %j",cmdExecutions);
	decideObj.executions = cmdExecutions;
	return decideObj;
});

decisionProperty.onValue(function(decideObj){
	console.log("Deciding the server to use for command: " + decideObj.commandName);
	// Find who has executed the least commands and pass the hostname
	var lowestCount = Number.MAX_VALUE;
	var lowestPort = "";
	for(var port in decideObj.executions){
		if(decideObj.executions[port]<lowestCount){
			lowestCount=decideObj.executions[port];
			lowestPort=port;
		}
	}
	decideObj.ackFunction(lowestPort);
});


var pollEvents = Bacon.fromPoll(5000, function(){
	// Ping all alive servers to make sure they are up.
	for (var hostPort in runningProcessors) {
		//runningProcessors[hostPort]=false;
		var clisocket = sockioClient('http://' + hostPort);
		console.log("Pinging: "+hostPort);
		clisocket.on('connect', function() {
			clisocket.emit(events.ping, "", function(){
				//Ack received
				runningProcessors[hostPort]=true;
			});
		});
	}
	return Bacon.Next("");//Events for stream
});


pollEvents.onValue(function(value){
	//Do nothing. This is just here so that the polling can run
});
http.listen(8000, function() {
	console.log('Load balancing server listening on *:8000');
});

