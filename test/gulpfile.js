var gulp = require('gulp');
var mine = require('../index');

gulp.task('default', function() {
  return gulp.src('./files/**/*.tool').pipe(mine({dest:'./tools'}));
});