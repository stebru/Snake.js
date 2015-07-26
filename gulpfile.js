var gulp = require('gulp');
var babel = require('gulp-babel');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var babelify = require('babelify');
var fs = require('fs');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

gulp.task('serve', ['js', 'sass'], function() {
  browserSync.init({
    browser: ['Google Chrome Canary'],
    port: 8000,
    server: {
      baseDir: "./"
    }
  });

  gulp.watch(['src/*.js', 'src/*.scss'], ['watch']);
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

gulp.task('sass', function() {
  gulp.src(['bower_components/normalize.css/normalize.css', 'src/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['js', 'sass'], function() {
  browserSync.reload();
});
gulp.task('default', ['js', 'sass', 'serve']);
