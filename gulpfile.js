var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var semistandard = require('gulp-semistandard');
var concat = require('gulp-concat');
var less = require('gulp-less');
var del = require('del');

gulp.task('clean', function () {
  return del('./dist/');
});

gulp.task('semistandard', function () {
  return gulp.src([
    '**/*.js',
    '!node_modules/**/*',
    '!dist/**/*'
  ])
    .pipe(semistandard())
    .pipe(semistandard.reporter('default', {
      breakOnError: true
    }));
});

gulp.task('build-less', ['clean'], function () {
  return gulp.src('cd-common.less')
    .pipe(less({
      compress: true
    }))
    .pipe(rename('cd-common.min.css'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-images', ['clean'], function () {
  return gulp.src('images/**/*')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build-js', ['clean', 'semistandard'], function () {
  return gulp.src([
    '*/**/*.js',
    '!node_modules/**/*',
    '!dist/**/*'
  ])
    .pipe(concat('cd-common.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build', ['build-less', 'copy-images', 'build-js']);

gulp.task('watch', function () {
  gulp.watch('**/*.less', ['build-less']);
  gulp.watch('**/*.js', ['build-js']);
});

gulp.task('default', ['build']);
