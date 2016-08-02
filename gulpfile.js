var gulp = require('gulp'),
  rename = require('gulp-rename'),
  autoprefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  semistandard = require('gulp-semistandard'),
  less = require('gulp-less'),
  del = require('del');

gulp.task('clean', function () {
  return del('./dist/');
});

gulp.task('semistandard', function () {
  return gulp.src('cd-menu.js')
    .pipe(semistandard())
    .pipe(semistandard.reporter('default', {
      breakOnError: true
    }));
});

gulp.task('build-less', function () {
  return gulp.src('cd-menu.less')
    .pipe(less({
      compress: true
    }))
    .pipe(autoprefixer())
    .pipe(rename('cd-menu.min.css'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build', ['clean', 'semistandard', 'build-less'], function () {
  return gulp.src('cd-menu.js')
    .pipe(uglify())
    .pipe(rename('cd-menu.min.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function () {
  gulp.watch('cd-menu.less', ['build-less']);
});

gulp.task('default', ['build']);