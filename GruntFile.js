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
      
      babel: {
        dist: {
          files: [
            {
                expand: true,
                cwd: 'src/js',
                src: ['*.js', '*/*.js'],
                dest: 'srv/js'
            }
          ]
        }
      },
		
      pkg: grunt.file.readJSON('package.json')
	});
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-babel');
  
    grunt.registerTask('default', ['browserify', 'babel']);
}
