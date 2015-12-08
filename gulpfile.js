const gulp              = require('gulp');
const webserver         = require('gulp-webserver');
const concat            = require('gulp-concat');
const uglify            = require('gulp-uglify');
const sourcemaps        = require('gulp-sourcemaps');
const wrap              = require('gulp-wrap');
const replace           = require('gulp-replace');
const minifyCss         = require('gulp-minify-css');
const pack              = require('./package.json');

var wrappingFunction = '(function(){\n\'use strict\';\n<%= contents %>\n})();';

gulp.task('watch', ['build-dev'], function () {
    gulp.watch(['src/scripts/**/*.js', 'src/stylesheets/*.css'], ['build-dev']);
});

gulp.task('build-dev', ['compile-scripts', 'compile-stylesheets']);

gulp.task('compile-stylesheets', function () {
   gulp.src('src/stylesheets/**/*.css')
       .pipe(minifyCss())
       .pipe(gulp.dest('dist'));
});

gulp.task('compile-scripts', function () {
    gulp.src('src/scripts/**/*.js')
        .pipe(replace(/("|')use strict\1;*/g, ''))
        .pipe(concat(pack.name + '.js'))
        .pipe(wrap(wrappingFunction))
        .pipe(gulp.dest('dist'));
});

gulp.task('build-dist', function () {
    gulp.src('src/scripts/**/*.js')
        .pipe(sourcemaps.init())
            .pipe(replace(/("|')use strict\1;*/g, ''))
            .pipe(uglify())
            .pipe(concat(pack.name + '.js'))
            .pipe(wrap(wrappingFunction))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
});

gulp.task('serve-dev', ['watch'], function () {
    gulp.src(['./', 'demo'])
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});