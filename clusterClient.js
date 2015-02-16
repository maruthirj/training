var net = require("net");
for(var i=0; i<8;i++){
	(function(){
		var clientSock = net.createConnection({port:5000,host:'localhost'},function(){
			console.log("Connection created");
			clientSock.on('data', function(data) {
				console.log("Data on client: "+data.toString('ascii'));
			});
			clientSock.on('end', function() {
				console.log('disconnected from server');
				clientSock.end();
			});
		});
	})();
}

