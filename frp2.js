var Bacon = require('baconjs');
var fs = require('fs');

function readFile() {
	fs.stat("/Users/maruthir/thread33.txt", function(err, stat) {
		if (err !== null) {
			callBack(err);
		}
		console.log("Opening read stream...");
		var readStream = fs.createReadStream("/Users/maruthir/monthly.csv");
		
		var dataStream = Bacon.fromEventTarget(readStream,"data");
		var endStream = Bacon.fromEventTarget(readStream,"end");
		
		var dataProperty = dataStream.scan(0,function(acc,chunk){
			console.log("Adding sizes...")
			acc+=chunk.length;
			return acc;
		});
		
		var reducedStream = dataProperty.sampledBy(endStream);
		
		reducedStream.onValue(function(size){
			console.log(size);
		});
		
	});
}

readFile();