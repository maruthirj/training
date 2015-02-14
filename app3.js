var fs = require("fs");

//Constructor function definition
function CommandProcessor(){
	
}

CommandProcessor.commands = [];
CommandProcessor.prototype.canProcessCommand = function(command){
	return false;//Base class processes no commands
};
CommandProcessor.prototype.processCommand = function(command, params){
	//Find a suitable command and invoke it
	for(var i=0; i<CommandProcessor.commands.length; i++){
		if(CommandProcessor.commands[i].canProcessCommand(command)){
			return CommandProcessor.commands[i].processCommand(command, params);
		}
	}
	throw "Invalid command: "+command;
};

function ListCommandProcessor(){
	
}

ListCommandProcessor.prototype = Object.create(CommandProcessor.prototype);

ListCommandProcessor.prototype.canProcessCommand = function(command){
	if(command!==undefined && command==='ls'){
		return true;
	}
	return false;
};

ListCommandProcessor.prototype.processCommand = function(command, params){
	if(params.length===undefined || params.length<1){
		throw "Command should have a parameter and should be a directory path";
	}
	var path = params[0];
	if(fs.existsSync(path)){
		var stats = fs.statSync(path);
		if(!stats.isDirectory()){
			throw "Specified path is not a directory";
		}
		var fileArr = fs.readdirSync(path);
		return fileArr;
	}else{
		throw "Specified path does not exist";
	}
};

function MkdirCommandProcessor(){
	
}

MkdirCommandProcessor.prototype = Object.create(CommandProcessor.prototype);

MkdirCommandProcessor.prototype.canProcessCommand = function(command){
	if(command!==undefined && command==='mkdir'){
		return true;
	}
	return false;
};

MkdirCommandProcessor.prototype.processCommand = function(command, params){
	if(params.length===undefined || params.length<2){
		throw "Command should have 2 params. Parent dir and new dir name";
	}
	var parent = params[0];
	var newDir = params[1];
	if(fs.existsSync(parent)){
		var stats = fs.statSync(parent);
		if(!stats.isDirectory()){
			throw "Specified parent: "+parent+" is not a directory";
		}
		fs.mkdirSync(newDir);
	}else{
		throw "Specified parent path "+parent+" does not exist";
	}
};

//Register the listcommand processor with the command processor
CommandProcessor.commands.push(new ListCommandProcessor());
CommandProcessor.commands.push(new MkdirCommandProcessor());

var cp = new CommandProcessor();
var files = cp.processCommand("ls", ['/Users/maruthir']);

for(var file in files){
	console.log(files[file]);
}
