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