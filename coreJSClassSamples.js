function reverse() {
	var arr = [];
	var arrToReverse = arguments[0];
	if ((typeof arguments[0].length) == "undefined") {
		console.log("params passed");
		arrToReverse = arguments;
	}
	for (var i = (arrToReverse.length - 1); i >= 0; i--) {
		arr.push(arrToReverse[i]);
	}
	return arr;
}

var r = reverse(1, 2, 3);
console.log(r);
r = reverse([ 1, 2, 3 ]);
console.log(r);

function sinCompute(num, callback) {
	function sinInternal() {
		var res = Math.sin(num);
		callback(res);
	}
	setTimeout(sinInternal, 1);
}

function handleResult(res) {
	console.log("Sin value = " + res);
}
sinCompute(5, handleResult);
console.log("Called sin function");

// Constructor function
Collection = function() {
	this.storage = [];
};
Collection.prototype.add = function(obj) {
	this.storage[this.storage.length] = obj;
};
Collection.prototype.remove = function(index) {
	if (index >= this.size())
		throw "Invalid index";
	var retVal = this.storage[index];
	return this.storage.splice(index, 1);
};
Collection.prototype.get = function(index) {
	return this.storage[index];
};
Collection.prototype.size = function() {
	return this.storage.length;
};

// Set constructor
Set = function() {
	Collection.call(this);
};
Collection.prototype.num = 10;

Set.prototype = Object.create(Collection.prototype);
Set.prototype.number = 10;
Set.prototype.add = function(obj) {
	for (var i = 0; i < this.size(); i++) {
		if (this.get(i) === obj) {
			return false;
		}
	}
	Collection.prototype.add.call(this, obj);
};

var col = new Set();
col.add(1);
col.add(2);
col.add(3);
col.add(4);
col.add(4);
for (var k = 0; k < col.size(); k++) {
	console.log(col.get(k));
}
console.log("-----------------");
col.remove(2);
for (var k = 0; k < col.size(); k++) {
	console.log(col.get(k));
}



function outer(){
	var counter = 0;
    function inner() {
    	counter += 1;
    	console.log(counter);
    	return counter;
    };
    return inner;
}
var add = outer();

add();
add();
add();






function singletonCreator() {
	var instance;
	function init() {
		function privateMethod() {
			console.log("I am private");
		}
		var privateVariable = "Im also private";
		var privateRandomNumber = Math.random();
		var obj = {
			publicMethod : function() {
				console.log("The public can see me!");
			},
			publicProperty : "I am also public",
			getRandomNumber : function() {
				return privateRandomNumber;
			}
		};
		return obj;
	};
	
	var creator = {
			getInstance : function() {
				if (!instance) {
					instance = init();
				}
				return instance;
			}
	};
	return creator;
};

var mySingleton=singletonCreator();
var singleton = mySingleton.getInstance();
var singleton2 = mySingleton.getInstance();
singleton.publicProperty="Hello";
console.log(singleton2.publicProperty);



