var net = require("net");
var profiler = require('v8-profiler');

function Car(model) {
	this.model = model;
}
var count =0;

var server = net.createServer(function(socket) { // 'connection' listener
//	for (var i = 0; i < 50000; i++) {
//		var c = new Car("Fiat 500");
//	}
	//var snapshot = profiler.takeSnapshot('testSnapshot');
	socket.write(new Buffer("Hello World"));
	socket.end();
});
server.listen(5000, function() { // 'listening' listener
	console.log('server bound');
});
