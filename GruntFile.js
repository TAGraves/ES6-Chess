module.exports = function(grunt) {
	grunt.initConfig({
      browserify: {
        dist: {
          files: {
            'dist/js/app.js' : 'src/js/app.js'
          }
        },

        options: {
          "transform": [["babelify", {
            presets: ['es2015']
          }]]
        }
      },
		
      pkg: grunt.file.readJSON('package.json')
	});
	grunt.loadNpmTasks('grunt-browserify');
  
    grunt.registerTask('default', ['browserify']);
}
