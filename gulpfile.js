var gulp = require('gulp'),
  connect = require('gulp-connect'),
  livereload = require('gulp-livereload');
 
gulp.task('webserver', function() {
  connect.server();
});
 
gulp.task('default', ['webserver']);


// Watch
gulp.task('watch', function() {

  // Watch .html files
  gulp.watch('src/html/**/*.html', ['html']);

  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('src/images/**/*', ['images']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['html/**']).on('change', livereload.changed);
  gulp.watch(['js/**']).on('change', livereload.changed);
  gulp.watch(['css/**']).on('change', livereload.changed);

});