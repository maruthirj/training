var net = require("net");
var cluster = require('cluster');

function Car(model) {
	this.model = model;
}

var c;

var server = net.createServer(function(socket) { // 'connection' listener
	if (c === undefined) {
		console.log("Creating new car in " + cluster.worker.id);
		c = new Car("Fiat 500 from worker " + cluster.worker.id);
	}
	socket.write(new Buffer(c.model));
	socket.end();
//	if(cluster.worker.id!=1){
//		cluster.worker.kill();	
//	}else{
//		throw new Error("Somethign went wrong");
//	}
});
server.listen(5000, function() { // 'listening' listener
	console.log('server bound in ' + cluster.worker.id);
});
