var gulp = require('gulp');
var babel = require('gulp-babel');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var babelify = require('babelify');
var fs = require('fs');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('serve', ['js'], function() {
  browserSync.init({
    browser: ['Google Chrome Canary'],
    port: 8000,
    server: {
      baseDir: "./"
    }
  });

  gulp.watch('src/*.js', ['js-watch']);
});

gulp.task('js', function() {
  browserify('src/index.js', {
    debug: true
  })
    .transform(babelify)
    .bundle()
    .on('error', function(err) {
      console.log('Error : ' + err.message);
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('js-watch', ['js'], browserSync.reload);
gulp.task('default', ['js', 'serve']);
