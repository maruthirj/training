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
	this.listCInstance = this;
}
//util.inherits(ListCommandProcessorAsyncE, CommandProcessorAsyncE);
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
					if(err!=null){
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

function errorHandle(message){
	console.log("Error Emitter: "+message);
}

//Register the listcommand processor with the command processor
var listCP = new ListCommandProcessorAsyncE()
listCP.on("error", errorHandle);
CommandProcessorAsyncE.commands.push(listCP);

var cpasynce = new CommandProcessorAsyncE();
function errorHandle(message){
	console.log("Error Emitter: "+message);
}
cpasynce.on("error", errorHandle);
cpasynce.processCommand('ls', ['/Users/maruthier'], function(err, filesArr){
	if(err!=null){
		throw err;
	}
	for(var index in filesArr){
		console.log("Async file: "+filesArr[index]);
	}
});