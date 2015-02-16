var EventEmitter = require('events').EventEmitter;
var net = require('net');
var cp = require('./CommandProcessor.js');

var cpasynce = new cp.CommandProcessorAsyncE();

cpasynce.processCommand('cat', ['/Users/maruthir/custFieldTest.html'], function(err, strData){
	if(err!==null){
		throw err;
	}
	console.log("Got data: "+strData.length);
	//console.log(strData);
});

var server = net.createServer(function(socket) { // 'connection' listener
	var dataStr = "";
	console.log('client connected');
	socket.on('end', function() {
		console.log('Ending server connection');
	});
	socket.on('data', function(buffer) {
		console.log('data arrived: '+buffer.toString('ascii'));
		dataStr+= buffer.toString('ascii').trim();
		var cmdAndParams = dataStr.split(" ");
		cpasynce.processCommand(cmdAndParams[0], cmdAndParams.slice(1,cmdAndParams.length), function(err, strData){
			if(err!==null){
				throw err;
			}
			console.log("Command result: "+strData);
			socket.write(new Buffer(strData));
			socket.end();
		});
	});
	socket.write('hello, welcome to node server. enter your command:\r\n');
	//c.pipe(c); for echoing
});
server.listen(4000, function() { // 'listening' listener
	console.log('server bound');
});
console.log("Server started...");
var clientSock = net.createConnection({port:4000,host:'localhost'},function(){
	clientSock.write("ls /Users/maruthir");
});

clientSock.on('data', function(data) {
	console.log("Data on client: "+data.toString('ascii'));
});
clientSock.on('end', function() {
	console.log('disconnected from server');
	clientSock.end();
});

