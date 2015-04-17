'use strict';

var pkg = require('./package.json'),
    gulp = require('gulp'),
  	clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    tap = require('gulp-tap'),
    jshint = require('gulp-jshint');

var src = [
  './src/DataException.js',
  './src/DataSource.js',
  './src/IOperation.js',
  './src/QueryOperation.js',
  './src/BatchOperation.js',
  './src/Query.js',
  './src/Repository.js'
];

gulp.task('clean', function() {
  return gulp.src([
      './' + pkg.name + '.js', 
      './' + pkg.name + '.min.js'
    ], { 
      read: false  
    })
    .pipe(clean());
});

gulp.task('concat', [ 'clean' ], function() {
  return gulp.src(src)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .pipe(tap(function (file) {
      var src = file.contents.toString();
      var lines = src.split('\n');
      for (var i = 0; i < lines.length; i++) {
        lines[i] = '  ' + lines[i];
      }
      file.contents = new Buffer(lines.join('\r\n'));
    }))
    .pipe(concat('./' + pkg.name + '.js', { newLine: '\r\n\r\n' }))
    .pipe(header([
      "(function (exports) {\r\n",
      "  'use strict';\r\n",
      "  exports = exports || {};\r\n",
      "  if (typeof define === 'function' && define.amd) {",
      "    define(function(){ return exports; });",
      "  } else {",
      "    window.rest = exports;",
      "  }\r\n",
      "  if (!('version' in exports)) {",
      "    exports.version = '<%= pkg.version %>';",
      "  }\r\n\r\n"
    ].join('\r\n'), { pkg : pkg }))
    .pipe(footer('\r\n\r\n} (window.rest));'))
    .pipe(gulp.dest('./'));
});

gulp.task('default', [ 'concat' ]);