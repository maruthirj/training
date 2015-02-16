var net = require("net");
var profiler = require('v8-profiler');
var memwatch = require('memwatch');

function Car(model) {
	this.model = model;
}
var count = 0;
var globalArr = [];

var server = net.createServer(function(socket) { // 'connection' listener
	for (var i = 0; i < 500; i++) {
		var c = new Car("Fiat 500");
		var x = Math.sin(i);
		globalArr.push(c);
		globalArr.push(x);
	}
	// var snapshot = profiler.takeSnapshot('testSnapshot');
	socket.write(new Buffer("Hello World"));
	socket.end();
});
server.listen(5000, function() { // 'listening' listener
	console.log('server bound');
});
var heapDiff;
memwatch.on('leak', function(info) {
	console.log("Memory leaking: %j", info);
//	if(heapDiff===undefined){
//		console.log("Starting heap diff");
//		heapDiff = new memwatch.HeapDiff();
//	}else{
//		console.log("Diff ended...")
//		var diff = heapDiff.end();
//		console.log("Heap Diff: %j",diff);
//		heapDiff = undefined;
//	}
});
