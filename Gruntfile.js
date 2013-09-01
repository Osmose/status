module.exports = function(grunt) {
    var connect = require('connect');
    var path = require('path');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
            build: {
                options: {
                    out: 'dist/static/js/bootstrap.js',
                    mainConfigFile: 'src/static/js/bootstrap.js',
                    name: 'bootstrap',
                    include: ['almond'],
                    wrap: true,
                    paths: {
                        almond: path.resolve('src/static/components/almond/almond'),
                    }
                }
            }
        },
        less: {
            build: {
                options: {
                    yuicompress: true,
                    paths: ['src']
                },
                files: {
                    './dist/static/css/styles.css': './src/static/less/styles.less'
                }
            }
        },
        preprocess: {
            build: {
                src: './src/index.html',
                dest: './dist/index.html',
                options: {
                    context: {
                        development: false
                    }
                }
            }
        },
        'gh-pages': {
            options: {
                base: 'dist'
            },
            src: ['**']
        }
    });

    grunt.registerTask('runserver', 'Start the development server.', function(port) {
        this.async();
        port = port || 8000;

        connect()
            .use(connect.static('src'))
            .use(connect.directory('src', {icons: true}))
            .use(connect.logger())
            .listen(port)
            .on('listening', function() {
                grunt.log.writeln('Starting static web server on port ' + port + '.');
            })
            .on('error', function(err) {
                if (err.code === 'EADDRINUSE') {
                    grunt.fatal('Port ' + port + ' is already in use by another process.');
                } else {
                    grunt.fatal(err);
                }
            });
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.registerTask('build', ['requirejs:build', 'preprocess:build', 'less:build']);
    grunt.registerTask('deploy', ['build', 'gh-pages']);
    grunt.registerTask('default', ['runserver']);
};
