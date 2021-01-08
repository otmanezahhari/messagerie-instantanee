var gulp = require('gulp');
var concat = require('gulp-concat');
var autoprefixer = require ('gulp-autoprefixer');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
// var notify = require("gulp-notify");
// const zip = require('gulp-zip');

//HTML Task

gulp.task('html', function() {
  
  return gulp.src('stage/html/*.pug')
        .pipe(pug({pretty :true}))
        .pipe(gulp.dest('dist'))
        .pipe(livereload())
})


// scss Task
gulp.task('css', function() {
  return gulp.src(['stage/css/**/*.css','stage/css/**/*.scss'])
         .pipe(sourcemaps.init())
         .pipe(sass({outputStyle: 'compressed'}).on('error',sass.logError))
         .pipe(autoprefixer())
         .pipe(concat('main.css'))
         .pipe(sourcemaps.write('.'))
         .pipe(gulp.dest('dist/css'))
         .pipe(livereload())
});

// Js Task
gulp.task('js', function() {
  return gulp.src('stage/js/*.js')
         .pipe(concat('main.js'))
         .pipe(uglify())
         .pipe(gulp.dest('dist/js'))
         .pipe(livereload())
});

// Task Compress Files
// gulp.task('compress', function(){
//   return gulp.src('dist/**/**.*')
//          .pipe(zip('website.zip'))
//          .pipe(gulp.dest('.'))
//          .pipe(notify("Compress TASK IS DONE"))
// })

//Watch task
gulp.task('watch', async function(){
  require('./server.js');
  livereload.listen();
  gulp.watch('stage/html/*.pug',gulp.series('html'));
  gulp.watch(['stage/css/**/*.css','stage/css/**/*.scss'],gulp.series('css'));
  gulp.watch('stage/js/*.js',gulp.series('js'));
  // gulp.watch('dist/**/**.*',gulp.series('compress'));
})