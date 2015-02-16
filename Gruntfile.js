var grunt = require('grunt');

grunt.registerTask('deploy', 'deployment task', function() {
	console.log('Deploying the app...');
});

grunt.registerTask('build', 'Performing build', function(name) {
	if (!name || !name.length) {
		grunt.warn('you need to provide an environment.');
		name = 'development';
	}

	console.log('building for: ' + name);
});

grunt.registerTask('default', [ 'build:development', 'deploy' ]);

grunt.initConfig({
	buildAll : {
		dev : {server: 'localhost'},
		prod : {server: '10.33.21.121'},
	},
	test: {
		devTests: {testfiles: ['test.js']},
	},
	nodeunit: {
	    all: ['test.js']
	},
	jshint: {
		all: ['*.js'],
		jshintrc: true
	}
});

grunt.loadNpmTasks('grunt-contrib-nodeunit');
grunt.loadNpmTasks('grunt-contrib-jshint');

grunt.registerMultiTask('buildAll', 'Building all', function() {
	grunt.log.writeln("Building for: "+this.target + ' on server: ' + this.data.server);
});

grunt.registerTask('verifyDev', [ 'buildAll:dev', 'jshint', 'nodeunit' ]);
