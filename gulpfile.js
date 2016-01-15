var gulp = require('gulp');
var bower = require('gulp-bower');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var del = require('del');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task("clean", function() {
    return del([
        'angular.jaydata.table.js',
        'angular.jaydata.table.min.js'        
    ]);
});

gulp.task("bower", ['clean'], function () {
    return bower();
});

gulp.task("build-default", ['clean'], function () {
    return gulp
            .src('src/**/*.js')
            .pipe(ngAnnotate({ add: true }))
            .pipe(concat('angular.jaydata.table.js'))
            .pipe(gulp.dest('./dist'));
});

gulp.task("build-min", ['build-default'], function () {
    return gulp
            .src('dist/angular.jaydata.table.js')
            .pipe(uglify())
            .pipe(concat('angular.jaydata.table.min.js'))
            .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['clean', 'build-default', 'build-min']);