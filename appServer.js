var http = require('http').Server();
var io = require('socket.io')(http);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on("clientevent",function(message){
		console.log("$$$ Clientevent: "+message.msg);
		socket.emit("serverevent","Thanks for the message");
  });
  
  socket.on("ackevent",function(message, ackFunc){
		console.log("$$$ Ack event: "+message.msg);
		ackFunc("Got it: "+message.msg);
  });
});

http.listen(8000, function(){
  console.log('listening on *:8000');
});

