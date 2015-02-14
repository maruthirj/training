var fs = require("fs");

function listDirectory(path){
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
}

function makeDirectory(parent,newDir){
	if(fs.existsSync(parent)){
		var stats = fs.statSync(parent);
		if(!stats.isDirectory()){
			throw "Specified parent: "+parent+" is not a directory";
		}
		fs.mkdirSync(newDir);
	}else{
		throw "Specified parent path "+parent+" does not exist";
	}
}

//Constructor function definition
function CommandProcessorBasic(){
	
}

CommandProcessorBasic.prototype.processCommand = function(command, params){
	//Find a suitable command and invoke it
	if(command===undefined){
		throw "Command not specified";
	}
	if(command=='ls'){
		return listDirectory(params[0]);
	}else if(command=='mkdir'){
		return makeDirectory(params[0], params[1]);
	}
	throw "Invalid command: "+command;
};