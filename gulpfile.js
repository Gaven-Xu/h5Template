'use strict';

let gulp = require('gulp'),
  sass = require('gulp-sass'),
  cached = require('gulp-cached'),
  sm = require('gulp-sourcemaps'),
  rename = require('gulp-rename'),
  plumber = require('gulp-plumber'),
  del = require('del'),
  connect = require('gulp-connect'),
  notify = require('gulp-notify'),
  apf = require('gulp-autoprefixer'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify');

// sass.compiler = require('node-sass');

// let dirname = "./public/h5/regist/";
const { series, parallel } = require('gulp');
let dev = true;
let dirname = ".";
let output = dirname;

/**
 * @description for scss
 */
function scss() {
  console.log('scss');
  let steam = gulp.src(dirname + '/scss/**/*.scss')
    .pipe(cached('scssCachedFile'))
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(sm.init())
    .pipe(apf({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(rename(function (path) {
      path.basename += '.min'
    }))
    .pipe(sm.write('./maps'))
    .pipe(gulp.dest(output + '/css'))
    .pipe(connect.reload());
  return steam;
}

function cssClean(cb) {
  return del([dirname + '/css/**'], cb);
}

function scssWatch(cb) {
  gulp.watch([dirname + '/scss/**/*.scss'], { events: 'all' }, scss);
  cb();
}

/**
 * @description for js
 */
function es() {
  console.log('es');
  let steam = gulp.src(dirname + '/es/**/*.js')
    .pipe(cached('esCachedFile'))
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(sm.init())
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.basename += '.min'
    }))
    .pipe(sm.write('./maps'))
    .pipe(gulp.dest(output + '/scripts'))
    .pipe(connect.reload());
  return steam;
}

function jsClean(cb) {
  return del([dirname + '/scripts/**'], cb);
}

function esWatch(cb) {
  gulp.watch([dirname + '/es/**/*.js'], { events: 'all' }, es);
  cb();
}

function cleanMaps(cb) {
  return del(['**/maps'], cb);
}

/**
 * connect 
 */
function connectWatch(cb) {
  connect.server({
    root: dirname,
    livereload: true
  });
  cb();
}

exports.clean = parallel(cssClean, jsClean);

exports.build = series(cssClean, jsClean, scss, es, cleanMaps);

exports.default = series(scss, es, scssWatch, esWatch);