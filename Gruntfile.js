module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');

  var globalConfig = {
  };

  grunt.initConfig({
    globalConfig: globalConfig,

    jshint: {
      src: [
        'app.js',
        'services/**',
        'public/script/*',
        'public/script/controller/*',
        'public/script/services/*',
      ],
      gruntfile: [
        'Gruntfile.js',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    jscs: {
      src: [
        'app.js',
        'services/**',
        'public/script/*',
        'public/script/controller/*',
        'public/script/services/*',
      ],
      gruntfile: [
        'Gruntfile.js',
      ],
      options: {
        config: '.jscsrc',
      },
    },
  });

  grunt.registerTask('default', ['build']);

  grunt.registerTask('build', [
    'jshint', 'jscs',
  ]);

};
