var cluster = require('cluster');
var net = require("net");
var cores = require('os').cpus().length;
cluster.schedulingPolicy = cluster.SCHED_RR;
cluster.setupMaster({
	exec : 'clusteredApp.js',
});
for (var i = 0; i < cores; i++) {
	cluster.fork();
}
cluster.on('exit', function(worker, code, signal) {
	if (worker.suicide === true) {
		console.log('Ignoring suicide death');
	} else {
		// Spawn another process to replace the died worker
		console.log("Replacing a dead worker!");
		cluster.fork();
	}
});
