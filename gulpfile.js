var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  less = require('gulp-less');
 
gulp.task('build-less', function () {
  return gulp.src('cd-menu.less')
    .pipe(less({
      compress: true
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
  gulp.watch('cd-menu.less', ['build-less']);
});

gulp.task('default', ['build-less']);