var gulp = require('gulp');
var babel = require('gulp-babel');
var browserSync = require('browser-sync').create();

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
  return gulp.src('src/snake.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('js-watch', ['js'], browserSync.reload);
gulp.task('default', ['js', 'serve']);
