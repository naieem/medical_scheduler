var gulp = require('gulp');
var zip = require('gulp-zip');
var del = require('del');

gulp.task('copy', function() {
  return gulp.src(['./**/*', '!./node_modules/**/*','!./debug.log','!./description.txt'])
  .pipe(gulp.dest('../medical_app_release'))
});

gulp.task('clean', function(){
     return del('../medical_app_release.zip', {force:true});
});
// gulp.task('copy_js', function() {
//   return gulp.src('./js/**/*')
//   .pipe(gulp.dest('../medical_app_release/js'))
// });
// gulp.task('copy_css', function() {
//   return gulp.src('./css/**/*')
//   .pipe(gulp.dest('../medical_app_release/css'))
// });
// gulp.task('copy_fonts', function() {
//   return gulp.src('./fonts/**/*')
//   .pipe(gulp.dest('../medical_app_release/fonts'))
// });
// gulp.task('copy_others', function() {
//   return gulp.src(['./icon.png','./config.xml','./gulpfile.js','./images.jpg','./index.html','./package.json','./splash.jpg'])
//   .pipe(gulp.dest('../medical_app_release'))
// });

gulp.task('zip', function() {
    return gulp.src('../medical_app_release/**/*')
        .pipe(zip('medical_app_release.zip'))
        .pipe(gulp.dest('../'));
});

gulp.task('default',['clean','copy']);
gulp.watch('./**/*', ['default']); 