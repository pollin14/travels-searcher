const gulp              = require('gulp');
const webserver         = require('gulp-webserver');
const concat            = require('gulp-concat');
const uglify            = require('gulp-uglify');
const replace           = require('gulp-replace');
const minifyCss         = require('gulp-minify-css');
const pack              = require('./package.json');

gulp.task('watch', ['build-dev'], function () {
    gulp.watch(['src/scripts/**/*.js', 'src/stylesheets/*.css'], ['build-dev']);
});

gulp.task('compile-stylesheets', function () {
   gulp.src('src/stylesheets/**/*.css')
       .pipe(minifyCss())
       .pipe(gulp.dest('dist'));
});

gulp.task('concat-scripts', function () {
    gulp.src('src/scripts/**/*.js')
        .pipe(concat(pack.name + '.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('compile-scripts', function () {
    gulp.src('src/scripts/**/*.js')
        .pipe(uglify())
        .pipe(concat(pack.name + '.js'))
        .pipe(gulp.dest('dist'));
});

/**
 * server to development
 */
gulp.task('serve-dev', ['watch'], function () {
    gulp.src(['./', 'demo'])
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});

/**
 * Buildings
 */
gulp.task('build-dev', ['concat-scripts', 'compile-stylesheets']);
gulp.task('build-dist', ['compile-scripts', 'compile-stylesheets']);
gulp.task('build', ['build-dist']);
gulp.task('default', ['build']);