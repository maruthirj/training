var fs = require("fs");
var EventEmitter = require('events').EventEmitter;

//Constructor function definition
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
				readStream.on("data",function(chunk){
					console.log("File stream data event "+chunk.length);
					dataString+=chunk.toString('ascii');
				});
				readStream.on("end",function(){
					console.log("File stream end event ");
					callBack(null, dataString);
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



cpasynce.processCommand('cat', ['/Users/maruthir/leads.sql'], function(err, strData){
	if(err!==null){
		throw err;
	}
	console.log("Got data: "+strData.length);
	//console.log(strData);
});