var gulp = require('gulp');
var zip = require('gulp-zip');
var del = require('del');
var imagemin = require('gulp-imagemin');

var connect = require('gulp-connect');

gulp.task('copy', function() {
    return gulp.src(['./**/*', '!./node_modules/**/*', '!./debug.log', '!./description.txt'])
        .pipe(gulp.dest('../medical_app_release'))
});

gulp.task('clean', function() {
    return del('../medical_app_release.zip', { force: true });
});

gulp.task('optimize', function() {
    gulp.src('img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist'))
});

gulp.task('zip', function() {
    return gulp.src('../medical_app_release/**/*')
        .pipe(zip('medical_app_release.zip'))
        .pipe(gulp.dest('../'));
});

gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true
  });
});

gulp.task('default', ['clean', 'copy', 'optimize']);
gulp.watch('./**/*', ['default']);