/**
 * command client
 */
var sockioClient = require('socket.io-client');
var http = require('http').Server();
var io = require('socket.io')(http);
var events = require('./Constants.js').Events;
var consts = require('./Constants.js').Constants;


var lbsocket = sockioClient('http://localhost:8000');
lbsocket.emit(events.decideServer,"ls",function(port){
	console.log("Port offered: "+port);
	var cpsocket = sockioClient('http://'+port);
	
	var command = {
		name : 'ls',
		params : [ '/Users/maruthir' ],
	};
	cpsocket.emit(events.processCommand,command,function(result){
		console.log("Command result: "+result);
		cpsocket.disconnect();
		lbsocket.disconnect();
	});
});
