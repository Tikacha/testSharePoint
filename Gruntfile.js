'use strict';


var getWebDavTarget, getHttpPath;

getWebDavTarget = function() {
  var webDavProperty = 'sdf';
  var webDavFolder =  'sdfsdf';
  return (webDavProperty + '/_catalogs/masterpage/' + webDavFolder);
};

getHttpPath = function() {
  var DesignFolder =  'sdfsdf';
  return ('/_catalogs/masterpage/' + DesignFolder);
};


module.exports = function(grunt) {


  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);


  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);


  // Configurable paths
  var config = {
    app: 'app',
    dist: 'build',
    temp: '.tmp',
    targetWebDav: getWebDavTarget(),
    targetHttpPath: getHttpPath()
  };


  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },

      gruntfile: {
        files: ['Gruntfile.js']
      },

      js: {
        files: ['<%= config.app %>/js/{,*/}*.js'],
        tasks: ['jshint'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      
      compass: {
        files: ['<%= config.app %>/sass/{,*/}*.{scss,sass}'],
        tasks: ['compass', 'autoprefixer']
      },
      
      styles: {
        files: ['<%= config.app %>/sass/{,*/}*.css'],
        tasks: ['newer:copy:css', 'autoprefixer']
      },

      jade: {
        files: ['<%= config.app %>/jade/{,*/}*.jade'],
        tasks: ['jade','wiredep']
      },

      //webdav_sync: {
      // options: {
      //    local_path: '<%= config.app %>/**',
      //     remote_path: 'Z:\\_catalogs\\masterpage\\_SASSV2',
      //     sendImmediately: true,
      //     strictSSL: false
      //  }
      //},

      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/{,*/}*.html',
          '.tmp/css/{,*/}*.css',
          '.tmp/js/{,*/}*.js',
          '<%= config.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
          ]
      }
    },//End watch



    // Watches files for changes and runs tasks based on the changed files
    watchMP: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },

      gruntfile: {
        files: ['Gruntfile.js']
      },

      js: {
        files: ['<%= config.app %>/js/{,*/}*.js'],
        tasks: ['jshint'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      
      compass: {
        files: ['<%= config.app %>/sass/{,*/}*.{scss,sass}'],
        tasks: ['compass', 'autoprefixer']
      },
      
      styles: {
        files: ['<%= config.app %>/sass/{,*/}*.css'],
        tasks: ['newer:copy:css', 'autoprefixer']
      },

      jade: {
        files: ['<%= config.app %>/jade/{,*/}*.jade'],
        tasks: ['jade','wiredep']
      },

      //webdav_sync: {
      // options: {
      //    local_path: '<%= config.app %>/**',
      //     remote_path: 'Z:\\_catalogs\\masterpage\\_SASSV2',
      //     sendImmediately: true,
      //     strictSSL: false
      //  }
      //},

      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/{,*/}*.html',
          '<%= config.temp %>/css/{,*/}*.css',
          '<%= config.temp %>/js/{,*/}*.js',
          '<%= config.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
          ]
      }
    },



    connect: {

      options: {
        port: 9000,
        open: true,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost',

        middleware: function(){
          var middleware = [];

          middleware.push(function(req, res, next) {
            if (req.url !== "/") return next();
            res.setHeader("Content-type", "text/html");
            var html = grunt.file.read("<%= config.app %>/index.html");
            res.end(html);
          });

          middleware.push(function(req, res, next){
            if (req.url !== "<%= config.app %>/sass/main.css") return next();
            res.setHeader("Content-type", "text/css");
            var css = "";

            var files = grunt.file.expand("<%= config.app %>/sass/*.css");
            for (var i = 0; i < files.length; i++) {
              css += grunt.file.read(files[i]);
            }

            res.end(css);
          });

          middleware.push(function(req, res){
            res.statusCode = 404;
            res.end("Not Found");
          });

          return middleware;
          }
      },

      livereload: {
        options: {
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.app)
            ];
          }
        }
      },

      dist: {
        options: {
          base: '<%= config.dist %>',
          livereload: false
        }
      }
    }, // End Connect


    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '<%= config.temp %>'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        devel: true,
        browser: true
      },
      all: [
        //'Gruntfile.js',
        '<%= config.app %>/js/{,*/}*.js',
        '!<%= config.app %>/js/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },

    

    
    // cf https://github.com/gruntjs/grunt-contrib-compass
    compass: {
      options: {
          sassDir: '<%= config.app %>/sass',
          cssDir: '<%= config.temp %>/css',
          fontDir: '<%= config.app %>/sass/fonts',
          imagesDir: '<%= config.app %>/img',
          relativeAssets: true,
          outputStyle: 'nested',
          noLineComments: false,
          environment: 'development'
      },

      server: {
        options: {
          debugInfo: true
        }
      }
    },

    

    // Documentation system - http://sassdoc.com/
    sassdoc: {
      sassdoc: '<%= config.app %>/sass',
      options: {
          display: {
          access: ['public', 'private'],
          alias: true,
          watermark: true,
        },
        groups: {
          slug: 'Title',
          helpers: 'Helpers',
          hacks: 'Dirty Hacks & Fixes',
          'undefined': 'Ungrouped',
        }
      }
    },


    jade: {
      html: {
        src: '<%= config.app %>/jade/*.jade',
        dest: '<%= config.app %>',
        options: {
          client: false,
          basePath: '<%= config.app %>/jade',
          pretty: true,
          locals: {
            masterPath: '<%= config.app %>',
            imagePath: '<%= config.app %>/img',
            stylePath: '<%= config.app %>/sass',
            scriptPath: '<%= config.app %>/js',
            deploy: false
          }
        }
      }
    },


    // Generates a custom Modernizr build that includes only the tests you
    // reference in your app
    modernizr: {
      dist: {
        devFile: 'bower_components/modernizr/modernizr.js',
        outputFile: '<%= config.dist %>/js/vendor/modernizr.js',
        files: {
          src: [
            '<%= config.dist %>/js/{,*/}*.js',
            '<%= config.dist %>/css/{,*/}*.css',
            '!<%= config.dist %>/js/vendor/*'
          ]
        },
        uglify: true
      }
    },


    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
        map: {
          prev: '.tmp/css/'
        }
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.temp %>/css/',
          src: '{,*/}*.css',
          dest: '<%= config.temp %>/css/'
        }]
      }
    },

    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        ignorePath: /^\/|\.\.\//,
        src: ['<%= config.app %>/index.html']
      },
      compass: {
        src: ['<%= config.app %>/sass/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= config.dist %>/js/{,*/}*.js',
            '<%= config.dist %>/css/{,*/}*.css',
            '<%= config.dist %>/img/{,*/}*.*',
            '<%= config.dist %>/css/fonts/{,*/}*.*',
            '<%= config.dist %>/*.{ico,png}'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%= config.dist %>'
      },
      html: '<%= config.app %>/index.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%= config.dist %>',
          '<%= config.dist %>/img',
          '<%= config.dist %>/css'
        ]
      },
      html: ['<%= config.dist %>/{,*/}*.html'],
      css: ['<%= config.dist %>/css/{,*/}*.css']
    },

    // Minified Images files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/img',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%= config.dist %>/img'
        }]
      }
    },
    // Minified SVG files in the dist folder
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/img',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/img'
        }]
      }
    },

    // Minified HTML files in the dist folder
    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          // true would impact styles with attribute selectors
          removeRedundantAttributes: false,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: '{,*/}*.html',
          dest: '<%= config.dist %>'
        }]
      }
    },


    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'img/{,*/}*.webp',
            '{,*/}*.html',
            'css/fonts/{,*/}*.*',
            'js/{,*/}*.js'
          ]
        }]
      },
      deploy: {
         files: [{
           expand: true,
           dot: true,
           cwd: '<%= config.dist %>',
           dest: '<%= config.targetWebDav %>',
           filter: 'isFile',
           src: ['**']
         }]
      },
      styles: {
        expand: true,
        dot: true,
        cwd: '<%= config.app %>/sass',
        dest: '<%= config.temp %>/css/',
        src: '{,*/}*.css'
      }
    },

    rename: {
      main: {
        files: [
            {src: ['<%= config.app %>/index.html'], dest: '<%= config.app %>/index.master'},
            ]
      },

      MP: {
        files: [
            {src: ['<%= config.dist %>/index.html'], dest: '<%= config.dist %>/index.master'},
            ]
      }
    },

    // webdav_sync: {
    //   options: {
    //      local_path: '<%= config.dist %>/**',
    //      remote_path: 'Z:\\_catalogs\\masterpage\\_SASSV2',
    //      sendImmediately: true,
    //      strictSSL: false
    //   }
    // },


    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [
      'compass:server'
      ],

      dist: [
        'compass',
        'imagemin',
        'svgmin'
      ]
    },


    // By default, your `index.html`'s <!-- Usemin block --> will take care
    // of minification. These next options are pre-configured if you do not
    // wish to use the Usemin blocks.
    uglify: {
      main: {
        src: '<%= config.app %>/js/{,*/}*.js',
        dest:'<%= config.dist %>/js/main.js'
      },
      MP: {
        src: '/js/{,*/}*.js',
        dest:'/js/main.min.js'
      }
    }

    // concat: {
    //   dist: {
    //     src: ["/index.html"],
    //     dest: "/index.html"
    //   }
    // },


    // cssmin: {
    //    dist: {
    //      files: {
    //        '/css/main.css': [
    //          '.tmp/css/{,*/}*.css',
    //          '/css/{,*/}*.css'
    //        ]
    //      }
    //    }
    //


  });


  grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function (target) {
    if (grunt.option('allow-remote')) {
      grunt.config.set('connect.options.hostname', '0.0.0.0');
    }
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'jade',
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });


  grunt.registerTask('build', [
    'clean:dist',
    'jade',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'cssmin',
    'copy:dist',
    'uglify',
    'modernizr',
    'rev',
    'usemin',
    //'htmlmin',
    'rename'
    //'sassdoc'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'build'
  ]);


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////// SHAREPOINT //////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // SP Serve
  grunt.registerTask('serveMP', 'start the server and preview your app, --allow-remote for remote access', function (target) {
    if (grunt.option('allow-remote')) {
      grunt.config.set('connect.options.hostname', '0.0.0.0');
    }
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'jade',
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      //'connect:livereload',
      'rename',
      'watch'
    ]);
  });

  // SP Build
  grunt.registerTask('buildMP', [
    'clean:dist',
    'jade',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'cssmin',
    'copy:dist',
    'uglify',
    'modernizr',
    //'rev',
    'usemin',
    //'htmlmin',
    'rename:MP'
    //'sassdoc'
  ]);

  // SP Deploy
  
    grunt.registerTask('deploy', [
      'copy:deploy'
    ]);
  

};
