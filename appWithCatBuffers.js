var fs = require("fs");
var util = require('util');
var EventEmitter = require('events').EventEmitter;

//Constructor function definition
function CommandProcessorAsyncE(){
	
}

//Extend command processor from event emitter
//util.inherits(CommandProcessorAsyncE, EventEmitter);
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
		if(true){
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
					console.log("Sending results..."+callBack);
					callBack(null,filesArr);
				});
			});
		}else{
			console.log("Path does not exist");
			listCPObj.emit("error", new Error("Specified path does not exist"));
			callBack(new Error("Specified path does not exist"));
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
	var fileDescriptor=null;
	var buffer = new Buffer(1000);

	
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
				console.log("Opening file...");
				fs.open(path, "r", function(err, fd){
					//Assign value to higher scope var
					fileDescriptor=fd;
					if(err!==null){
						callBack(err);
					}
					console.log("Reading file...");
					function readData(err, bytesRead, buffer){
						dataString+= buffer.toString("ascii");
						console.log(sequenceCount+ ". got data of size: "+bytesRead);
						if(bytesRead==1000){
							//There is probably more to read
							buffer.fill(32);//Fill spaces
							fs.read(fileDescriptor, buffer, 0, 1000, null, readData);
						}else{
							//Done reading.. call the end callback
							callBack(null,dataString);
						}
					}
					fs.read(fd, buffer, 0, 1000, null, readData);
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


cpasynce.processCommand('ls', ['/Users/marusthi'], function(err, strData){
//	if(err!==null){
//		throw err;
//	}
	console.log(strData);
});

cpasynce.processCommand('cat', ['/Users/maruthir/custFieldTest.html'], function(err, strData){
	if(err!==null){
		throw err;
	}
	console.log(strData);
});