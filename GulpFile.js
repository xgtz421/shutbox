var gulp = require('gulp');
var ejs = require('gulp-ejs');
var log = require('fancy-log')
var uglify = require('gulp-uglify');
var del = require('del');

gulp.task('entrance', function() {
    return gulp.src('bin/www')
        .pipe(gulp.dest('dist/bin'));
});

gulp.task('app', function() {
    return gulp.src('app.js')
        .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function(done) {
    return gulp.src([
            './**/*.js',
            '!GulpFile.js',
            '!node_modules/**/*.js',
        ])
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
    return gulp.src('public/**/*.css')
        .pipe(gulp.dest('dist/public'));
});

gulp.task('ejs', function(){
    return gulp.src('views/*.ejs')
        .pipe(gulp.dest('dist/views'));
});

gulp.task('clean', function() {
    return del(['dist']);
});



gulp.task('default', 
    gulp.series('clean', 
        gulp.parallel('scripts', 'styles', 'entrance')
    ));