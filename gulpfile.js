'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var jasmine = require('gulp-jasmine');
var babel = require("gulp-babel");
var karma = require('karma');

gulp.task('clean', () => {
  return gulp.src('./dist/', {
    read: false
  })
  .pipe(clean());
});

// gulp.task('build_old1', [ 'clean' ], () => {
//   return gulp
//     .src("./src/**/*.es6.js")
//     .pipe(sourcemaps.init())
//     .pipe(rename((path) => {
//       path.basename = path.basename.replace(".es6", "");
//     }))
//     .pipe(babel({
//       plugins: [
//         "babel-plugin-transform-es2015-modules-commonjs"
//       ]
//     }))
//     .pipe(sourcemaps.write("."))
//     .pipe(gulp.dest("./dist/"));
// });

gulp.task('build', () => {
  return browserify({
    entries: './src/rest.js',
    extensions: [ '.js' ],
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

gulp.task('build-spec', [ 'build' ], () => {
  return gulp
    .src("./spec/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel({
      plugins: [
        "babel-plugin-transform-es2015-modules-commonjs"
      ]
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist/spec"));
});

gulp.task('node-tests', () => {
  return gulp.src('./spec/**/*.spec.js')
   .pipe(jasmine({
     verbose: true
   }));
});

gulp.task('browser-tests', done => {
  return new karma.Server({
    frameworks: [ 'jasmine' ],
    reporters: [ 'spec' ],
    browsers: [ 'Chrome', 'Firefox' ],
    files: [
      './dist/rest.js',
      './dist/spec/**/*.js'
    ],
    singleRun: true
  }, done).start();
});

gulp.task('default', [ 'clean', 'build', 'build-spec' ]);