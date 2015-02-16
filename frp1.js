var Bacon = require('baconjs');
var fs = require('fs');

function readFile() {
	fs.stat("/Users/maruthir/thread33.txt", function(err, stat) {
		if (err !== null) {
			callBack(err);
		}
		console.log("Opening read stream...");
		var readStream = fs.createReadStream("/Users/maruthir/monthly.csv");
		var dataSize=0;
		var dataStream = Bacon.fromEventTarget(readStream,"data");
		dataStream.onValue(function(chunk){
			dataSize += chunk.length;
		});
		var endStream = Bacon.fromEventTarget(readStream,"end");
		endStream.onValue(function(chunk){
			console.log(dataSize);
		});
		
	});
}

readFile();