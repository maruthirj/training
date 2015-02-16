//Use promises here
var fs = require("fs");
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var net = require('net');
var Promise = require("bluebird");
Promise.promisifyAll(fs);

// Constructor function definition
function CommandProcessorAsyncE() {

}

// Extend command processor from event emitter
// util.inherits(CommandProcessorAsyncE, EventEmitter);
CommandProcessorAsyncE.prototype = Object.create(EventEmitter.prototype);
CommandProcessorAsyncE.commands = [];
CommandProcessorAsyncE.prototype.canProcessCommand = function(command) {
	return false;// Base class processes no commands
};
CommandProcessorAsyncE.prototype.processCommand = function(command, params,
		callBack) {
	// Find a suitable command and invoke it
	for (var i = 0; i < CommandProcessorAsyncE.commands.length; i++) {
		if (CommandProcessorAsyncE.commands[i].canProcessCommand(command)) {
			return CommandProcessorAsyncE.commands[i].processCommand(command,
					params, callBack);
		}
	}
	throw "Invalid command: " + command;
};

function ListCommandProcessorAsyncE() {
}
ListCommandProcessorAsyncE.prototype = Object
		.create(CommandProcessorAsyncE.prototype);

ListCommandProcessorAsyncE.prototype.canProcessCommand = function(command) {
	if (command !== undefined && command === 'ls') {
		return true;
	}
	return false;
};

ListCommandProcessorAsyncE.prototype.processCommand = function(command, params,
		callBack) {
	if (params.length === undefined || params.length < 1) {
		throw "Command should have a parameter and should be a directory path";
	}
	var path = params[0];
	console.log("Checking file exists...");
	var listCPObj = this;
	fs.statAsync(path).then(function(stat) {
		if (!stat.isDirectory()) {
			throw new Error("Specified path is not a directory");
		}
		console.log("Reading directory...");
		return fs.readdirAsync(path);
	}).then(function(filesArr) {
		callBack(null, filesArr);
	}).caught(function(e) {
		console.log("Error in process command");
		callBack(e);
	});
};

function CatCommandProcessorAsyncE() {
}
CatCommandProcessorAsyncE.prototype = Object
		.create(CommandProcessorAsyncE.prototype);

CatCommandProcessorAsyncE.prototype.canProcessCommand = function(command) {
	if (command !== undefined && command === 'cat') {
		return true;
	}
	return false;
};

CatCommandProcessorAsyncE.prototype.processCommand = function(command, params,
		callBack) {
	var dataString = "";

	if (params.length === undefined || params.length < 1) {
		throw "Command should have 1 parameter and should be a <file path>";
	}
	var path = params[0];
	console.log("Checking file exists...");
	var catCPObj = this;
	fs.exists(path, function(exists) {
		if (exists) {
			console.log("Checking if directory...");
			fs.stat(path, function(err, stat) {
				if (err !== null) {
					callBack(err);
				}
				if (stat.isDirectory()) {
					callBack(new Error("Cannot cat a directory"));
					return;
				}
				console.log("Opening read stream...");
				var readStream = fs.createReadStream(path);
				readStream.on("data", function(chunk) {
					console.log("File stream data event " + chunk.length);
					dataString += chunk.toString('ascii');
				});
				readStream.on("end", function() {
					console.log("File stream end event ");
					callBack(null, dataString);
				});
			});
		} else {
			console.log("Path does not exist");
			callBack(new Error("Specified path does not exist: " + path));
		}
	});
};

// Register the listcommand processor with the command processor
var listCP = new ListCommandProcessorAsyncE();
var catCP = new CatCommandProcessorAsyncE();
CommandProcessorAsyncE.commands.push(listCP);
CommandProcessorAsyncE.commands.push(catCP);

var cpasynce = new CommandProcessorAsyncE();

// var cp = Promise.promisify(cpasynce.processCommand, cpasynce);//Method will
// be called in context of cpasyncce
// cp('ls', ['/Users/maruthir'])
// .then(function(strData){
// console.log("Got data with new promise method: "+strData.length);
// //console.log(strData);
// });
//

Promise.promisifyAll(CommandProcessorAsyncE.prototype);

var cpPromise = new CommandProcessorAsyncE();
cpasynce.processCommandAsync('ls', [ '/Users/masruthir' ]).then(
		function(strData) {
			console.log("Got data via promise: " + strData.length);
			// console.log(strData);
		}).caught(function(e) {
	console.log("Error in ls command");
	console.log(e.stack);
}).lastly(function() {
	console.log("Executed finally");
});
console.log("ls command fired");


var join = Promise.join;

var totalSize = 0;
Promise.reduce(
		[ fs.readFileAsync("package.json"), fs.readFileAsync("package2.json") ],
		function(totalSize, content) {
			console.log(content.toString('utf8'));
			return totalSize + content.toString('utf8').length;
		}, 0).then(function(total) {
				console.log("Total size of files: " + total);
		});

