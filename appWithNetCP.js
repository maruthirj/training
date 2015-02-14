var fs = require("fs");
var EventEmitter = require('events').EventEmitter;
var net = require('net');


// Constructor function definition
function CommandProcessorAsyncE(){
	
}

//Extend command processor from event emitter
CommandProcessorAsyncE.prototype = Object.create(EventEmitter.prototype);
CommandProcessorAsyncE.commands = [];
CommandProcessorAsyncE.prototype.canProcessCommand = function(command){
	return false;//Base class processes no commands
};
CommandProcessorAsyncE.prototype.processCommand = function(command, params, callBack){
	//Find a suitable command and invoke it
	for(var i=0; i<CommandProcessorAsyncE.commands.length; i++){
		if(CommandProcessorAsyncE.commands[i].canProcessCommand(command)){
			return CommandProcessorAsyncE.commands[i].processCommand(command, params, callBack);
		}
	}
	throw "Invalid command: "+command;
};

function ListCommandProcessorAsyncE(){
}
ListCommandProcessorAsyncE.prototype = Object.create(CommandProcessorAsyncE.prototype);

ListCommandProcessorAsyncE.prototype.canProcessCommand = function(command){
	if(command!==undefined && command==='ls'){
		return true;
	}
	return false;
};

ListCommandProcessorAsyncE.prototype.processCommand = function(command, params, callBack){
	if(params.length===undefined || params.length<1){
		throw "Command should have a parameter and should be a directory path";
	}
	var path = params[0];
	console.log("Checking file exists...");
	var listCPObj = this;
	fs.exists(path, function(exists){
		if(exists){
			console.log("Checking if directory...");
			fs.stat(path, function(err, stat){
				if(err!==null){
					callBack(err);
				}
				if(!stat.isDirectory()){
					callBack(new Error("Specified path is not a directory"));
				}
				console.log("Reading directory...");
				fs.readdir(path, function(err, filesArr){
					if(err!==null){
						callBack(err);
					}
					console.log("Sending results...");
					callBack(null,filesArr);
				});
			});
		}else{
			console.log("Path does not exist");
			callBack(new Error("Specified path does not exist: "+path));
		}
	});
};

function CatCommandProcessorAsyncE(){
}
CatCommandProcessorAsyncE.prototype = Object.create(CommandProcessorAsyncE.prototype);

CatCommandProcessorAsyncE.prototype.canProcessCommand = function(command){
	if(command!==undefined && command==='cat'){
		return true;
	}
	return false;
};

CatCommandProcessorAsyncE.prototype.processCommand = function(command, params, callBack){
	var dataString="";
	
	if(params.length===undefined || params.length<1){
		throw "Command should have 1 parameter and should be a <file path>";
	}
	var path = params[0];
	console.log("Checking file exists...");
	var catCPObj = this;
	fs.exists(path, function(exists){
		if(exists){
			console.log("Checking if directory...");
			fs.stat(path, function(err, stat){
				if(err!==null){
					callBack(err);
				}
				if(stat.isDirectory()){
					callBack(new Error("Cannot cat a directory"));
					return;
				}
				console.log("Opening read stream...");
				var readStream = fs.createReadStream(path);
				readStream.on('readable', function() {
					console.log("File stream ready to be read");
				});
				readStream.on("open",function(fileDescriptor){
					console.log("File stream opened");
				});
				readStream.on("data",function(chunk){
					console.log("File stream data event "+chunk.length);
					dataString+=chunk.toString('ascii');
				});
				readStream.on("end",function(){
					console.log("File stream end event ");
					callBack(null, dataString);
				});
				readStream.on("close",function(){
					console.log("File stream close event ");
				});
			});
		}else{
			console.log("Path does not exist");
			callBack(new Error("Specified path does not exist: "+path));
		}
	});
};
function errorHandle(message){
	console.log("Error Emitter: "+message);
}

//Register the listcommand processor with the command processor
var listCP = new ListCommandProcessorAsyncE();
var catCP = new CatCommandProcessorAsyncE();
listCP.on("error", errorHandle);
catCP.on("error", errorHandle);
CommandProcessorAsyncE.commands.push(listCP);
CommandProcessorAsyncE.commands.push(catCP);


var cpasynce = new CommandProcessorAsyncE();



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