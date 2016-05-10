'use strict';

var pkg = require('./package.json'),
    gulp = require('gulp'),
  	clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    tap = require('gulp-tap'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    stylish = require('gulp-jscs-stylish'),
    uglify = require('gulp-uglify'),
    jasmine = require('gulp-jasmine'),
    jasminePhantom = require('gulp-jasmine-phantom'),
    rename = require("gulp-rename"),

    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),

    sourcemaps = require('gulp-sourcemaps'),
    rename = require("gulp-rename"),
    babel = require("gulp-babel");

var src = [
  './src/UrlBuilder.js',
  './src/DataException.js',
  './src/DataSource.js',
  './src/IQueryTranslator.js',
  './src/QueryTranslator.js',
  './src/OperationContext.js',
  './src/IOperation.js',
  './src/QueryOperation.js',
  './src/BatchOperation.js',
  './src/Query.js',
  './src/Repository.js'
];

gulp.task('clean_old', function() {
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
    .pipe(jscs())
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'))
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

gulp.task('minify', function() {
  return gulp
    .src('./' + pkg.name + '.js')
    .pipe(rename('./' + pkg.name + '.min.js'))
    .pipe(sourcemaps.init())
      .pipe(uglify({
        mangle: false,
        compress: false
      }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'));
});

//gulp.task('test', [ 'concat', 'minify' ], function () {
//  return gulp.src('./spec/**/*.spec.js')
//    .pipe(jasmine({
//      verbose: true
//    }));
//});

gulp.task('build_old', [ 'concat', 'minify' ], function () {
  return gulp.src('./spec/**/*.spec.js')
    .pipe(jasminePhantom({
      jasmineVersion: '2.3',
      integration: true,
      keepRunner: './',
      vendor: [
        './' + pkg.name + '.js'
      ]
    }));
});

gulp.task('clean', () => {
  return gulp.src('./dist/', {
      read: false
    })
    .pipe(clean());
});

gulp.task('build_old1', [ 'clean' ], () => {
  return gulp
    .src("./src/**/*.es6.js")
    .pipe(sourcemaps.init())
    .pipe(rename((path) => {
      path.basename = path.basename.replace(".es6", "");
    }))
    .pipe(babel({
      plugins: [
        "babel-plugin-transform-es2015-modules-commonjs"
      ]
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist/"));
});

gulp.task('build', [ 'clean' ], () => {
  return browserify({
      entries: './src/rest.es6.js',
      extensions: [ '.js', '.es6.js' ],
      paths: [ './src' ],
      standalone: 'rest',
      debug: true
    })
    .transform('babelify', {
      plugins: [
        "babel-plugin-transform-es2015-modules-commonjs"
      ]
    })
    .bundle()
    .pipe(source('./rest.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./sample'));
});