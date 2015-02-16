var socket = require('socket.io-client')('http://localhost:8000');
socket.on('connect', function() {
	console.log("#### connected to socket server");
	socket.emit("clientevent", {msg: "Hello there..."});
	socket.emit("ackevent", {msg: "Hello there..."}, function(ackData){
		console.log("Acknowledgement: "+ackData);
	});
});

socket.on('serverevent', function(message) {
	console.log("#### Message from server: "+message);
});
socket.on('testevent', function(data) {
	console.log("#### test event: ",data);
});
socket.on('disconnect', function() {
	console.log("#### disconnected from socket server");
});

