var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');

const lessToCss = () =>
  gulp.src('./static/less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'static', 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./static/css'));

gulp.task('less', lessToCss);

gulp.task('watch', () => gulp.watch(['./static/less/**/*.less'], lessToCss));