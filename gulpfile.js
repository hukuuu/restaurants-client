var gulp = require('gulp');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = __dirname;
var LIVERELOAD_PORT = 35729;
 

var paths = {
  js: './app/js/**/*.js',
  modules: './app/js/**/module.js'
};

gulp.task('js', function () {         
  gulp.src([paths.modules, paths.js]) 
    .pipe(concat('app.js'))           
    .pipe(ngAnnotate())
    .pipe(gulp.dest('./app/'))        
});                                 

function startExpress() {
  var express = require('express');
  var app = express();
  app.use(express.static(EXPRESS_ROOT));
  app.listen(EXPRESS_PORT);
  console.log('server listening on port ', EXPRESS_PORT);
}
 
 
gulp.task('default',['js'], function () {
 
  startExpress();
  gulp.watch(['**/*.js'], ['js']);
});