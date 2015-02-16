var net = require("net");
var cluster = require('cluster');
var cores = require('os').cpus().length;

console.log("Number of cores = " + cores);

function Car(model) {
	this.model = model;
}

var c;

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
		if(c===undefined){
			console.log("Creating new car in "+cluster.worker.id);
			c = new Car("Fiat 500 from worker "+cluster.worker.id);
		}
		socket.write(new Buffer(c.model));
		socket.end();
	});
	server.listen(5000, function() { // 'listening' listener
		console.log('server bound in '+cluster.worker.id);
	});
}

