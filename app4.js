var fs = require("fs");


//Constructor function definition
function CommandProcessorAsync(){
	
}

CommandProcessorAsync.commands = [];
CommandProcessorAsync.prototype.canProcessCommand = function(command){
	return false;//Base class processes no commands
};
CommandProcessorAsync.prototype.processCommand = function(command, params, callBack){
	//Find a suitable command and invoke it
	for(var i=0; i<CommandProcessorAsync.commands.length; i++){
		if(CommandProcessorAsync.commands[i].canProcessCommand(command)){
			return CommandProcessorAsync.commands[i].processCommand(command, params, callBack);
		}
	}
	throw "Invalid command: "+command;
};

function ListCommandProcessorAsync(){
	
}

ListCommandProcessorAsync.prototype = Object.create(CommandProcessorAsync.prototype);

ListCommandProcessorAsync.prototype.canProcessCommand = function(command){
	if(command!==undefined && command==='ls'){
		return true;
	}
	return false;
};

ListCommandProcessorAsync.prototype.processCommand = function(command, params, callBack){
	if(params.length===undefined || params.length<1){
		throw "Command should have a parameter and should be a directory path";
	}
	var path = params[0];
	console.log("Checking file exists...");
	fs.exists(path, function(exists){
		if(exists){
			console.log("Checking if directory...");
			fs.stat(path, function(err, stat){
				if(!stat.isDirectory()){
					throw "Specified path is not a directory";
				}
				console.log("Reading directory...");
				fs.readdir(path, function(err, filesArr){
					console.log("Sending results..."+callBack);
					callBack(filesArr);
				});
			});
		}else{
			console.log("Path does not exist");
			console.trace();
			throw "Specified path does not exist";
		}
	});
};


//Register the listcommand processor with the command processor
CommandProcessorAsync.commands.push(new ListCommandProcessorAsync());

cp.processCommand("mkdir",['/Users/maruthir','temp']);

var cpasync = new CommandProcessorAsync();
cpasync.processCommand('ls', ['/Users/maruthir'], function(filesArr){
	for(var index in filesArr){
		console.log("Async file: "+filesArr[index]);
	}
});
console.log("Directory listing command fired.");
