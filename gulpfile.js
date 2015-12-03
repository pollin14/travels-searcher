const gulp              = require('gulp');
const webserver         = require('gulp-webserver');
const concat            = require('gulp-concat');
const uglify            = require('gulp-uglify');
const sourcemaps        = require('gulp-sourcemaps');
const wrap              = require('gulp-wrap');
const replace           = require('gulp-replace');
const pack              = require('./package.json');

gulp.task('build-dev', ['build-dist'], function () {
    gulp.src('dist/**/*')
        .pipe(gulp.dest('public'));
});

gulp.task('build-dist', function () {
    gulp.src('src/scripts/**/*.js')
        .pipe(sourcemaps.init())
            .pipe(replace(/("|')use strict\1;*/g, ''))
            .pipe(uglify())
            .pipe(concat(pack.name + '.js'))
            .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
});


gulp.task('serve-dev', function () {
    gulp.src(['build', 'public'])
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});