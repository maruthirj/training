var cp = require('./CommandProcessor.js');
var fs = require("fs");

var fs_exists = null;

exports.testModulePresense = function(test){
	try{
	    var casync = new cp.CommandProcessorAsyncE();
	    test.ok(true, "All ok");
	}catch(err){
		test.ok(false,"Error, could not create cp: "+err);
	}
    test.done();
};

exports.testAsync = function(test){
	test.expect(2);
	setTimeout(function(){
		test.ok(true,"All ok");
		setTimeout(function(){
			test.ok(true,"All ok");
			test.done();
		},2000);
	},2000);
};

exports.group = {

	setUp : function(callback) {
		console.log("Calling setup...");
		fs_exists = fs.exists;
		fs.exists = function(path,callback) {
			console.log("Exists called...");
			callback(true);
		};
		callback();
	},
	tearDown : function(callback) {
		console.log("Calling tear down...");
		fs.exists = fs_exists;
		callback();
	},

	testLs : function(test) {
		console.log("Testing ls...");
		test.expect(3);
		var cpasynce = new cp.CommandProcessorAsyncE();
		cpasynce.processCommand('ls', [ '/Users/maruthir' ], function(err,
				strData) {
			console.log(err);
			test.ok(err == null, "Error occured "+(err!=null?err.message:""));
			test.ok(strData != null, "No data returned");
			test.done();
			console.log("Test done");
		});
		test.ok(true, "Test failed");
	},

	testCat : function(test) {
		test.expect(3);
		var cpasynce = new cp.CommandProcessorAsyncE();
		cpasynce.processCommand('cat',
				[ '/Users/maruthir/custFieldTest.html' ],
				function(err, strData) {
					test.ok(err == null, "Error occured ");
					test.ok(strData != null, "No data returned");
					test.done();
				});
		test.ok(true, "Test failed");
	}
}

