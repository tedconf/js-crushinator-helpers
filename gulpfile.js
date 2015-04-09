var gulp = require('gulp');
var babel = require('gulp-babel');
var mocha = require('gulp-mocha');

gulp.task('transpile', function () {
  return gulp.src('src/crushinator.js')
    .pipe(babel())
    .pipe(gulp.dest('tmp/es5'));
});

gulp.task('test', ['transpile'], function () {
  return gulp.src('tests/*.spec.js')
    .pipe(mocha());
});

gulp.task('watch', function() {
  gulp.watch('src/*.js', ['test']);
  gulp.watch('tests/*.spec.js', ['test']);
});

gulp.task('default', ['test', 'watch']);
