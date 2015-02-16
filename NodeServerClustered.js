var net = require("net");
var cluster = require('cluster');
var cores = require('os').cpus().length;

console.log("Number of cores = " + cores);

function Car(model) {
	this.model = model;
}

if (cluster.isMaster) {
	// Fork workers.
	for (var i = 0; i < cores; i++) {
		cluster.fork();
	}

	cluster.on('exit', function(worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
	});
} else {
	// Workers can share any TCP connection
	// In this case its a Socket server
	var server = net.createServer(function(socket) { // 'connection' listener
		for (var i = 0; i < 50000; i++) {
			var c = new Car("Fiat 500");
		}
		socket.write(new Buffer("Hello World"));
		socket.end();
	});
	server.listen(5000, function() { // 'listening' listener
		console.log('server bound');
	});
}

