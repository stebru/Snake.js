var gulp = require('gulp');
var babel = require('gulp-babel');
var browserSync = require('browser-sync').create();

gulp.task('browser-sync', function() {
  browserSync.init({
    browser: ['Google Chrome Canary'],
    port: 8000,
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('babel', function() {
  return gulp.src('src/snake.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['babel', 'browser-sync']);
