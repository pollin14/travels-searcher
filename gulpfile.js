/* jshint node: true, esnext: true */

const gulp          = require('gulp');
const webserver     = require('gulp-webserver');

gulp.task('serve-dev', function () {
    gulp.src('public')
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});