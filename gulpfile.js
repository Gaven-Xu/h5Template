'use strict';

let gulp = require('gulp'),
  sass = require('gulp-sass'),
  cached = require('gulp-cached'),
  sm = require('gulp-sourcemaps'),
  rename = require('gulp-rename'),
  plumber = require('gulp-plumber'),
  del = require('del'),
  connect = require('gulp-connect'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  apf = require('gulp-autoprefixer'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),
  obfuscator = require('gulp-javascript-obfuscator'),
  zip = require('gulp-zip'),
  gulpif = require('gulp-if'),
  apidoc = require('gulp-apidoc'),
  jsdoc = require('gulp-jsdoc3');

// sass.compiler = require('node-sass');

// let dirname = "./public/h5/regist/";
const { series, parallel } = require('gulp');
let dirname = "./src";
// let output = "./dist";
let args = process.argv.slice(2);
let isDev = args.indexOf('--dev') !== -1

/**
 * @description for scss
 */
function scss() {

  let steam = gulp.src(dirname + '/scss/**/*.scss')
    .pipe(cached('scssCachedFile'))
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(gulpif(isDev, sm.init())) // 开发模式，生成代码sourcemaps
    .pipe(apf({
      browsers: ['last 2 versions', 'Android >= 4.0'],
      cascade: true, //是否美化属性值 默认：true
      remove: true //是否去掉不必要的前缀 默认：true 
    }))
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(rename(function (path) {
      path.basename += '.min'
    }))
    .pipe(gulpif(isDev, sm.write('./maps'))) // 开发模式，生成代码sourcemaps
    .pipe(gulp.dest(dirname + '/css'))
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
  let steam = gulp.src([dirname + '/es/**/*.js'])
    .pipe(cached('esCachedFile'))
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(gulpif(isDev, sm.init())) // 开发模式，生成代码sourcemaps
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulpif(!isDev, obfuscator())) // 非开发模式，则混淆加密js代码
    .pipe(rename(function (path) {
      path.basename += '.min'
    }))
    .pipe(gulpif(isDev, sm.write('./maps'))) // 开发模式，生成代码sourcemaps
    .pipe(gulp.dest(dirname + '/js'))
    .pipe(connect.reload());

  return steam;
}

function ellaH5() {
  let steam = gulp.src([dirname + '/lib/ellaH5/*.js'])
    .pipe(cached('esH5CachedFile'))
    .pipe(gulpif(isDev, sm.init())) // 开发模式，生成代码sourcemaps
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(babel())
    .pipe(uglify())
    // .pipe(gulpif(!isDev, obfuscator())) // 非开发模式，则混淆加密js代码
    .pipe(concat('ellaH5.min.js'))//合并后的文件名
    .pipe(gulpif(isDev, sm.write('./maps'))) // 开发模式，生成代码sourcemaps
    .pipe(gulp.dest(dirname + '/lib'))
    .pipe(connect.reload());

  return steam;
}

function jsClean(cb) {
  return del([dirname + '/js/**', dirname + '/lib/ellaH5.min.js'], cb);
}

function esWatch(cb) {
  // es发生变化，编译es，同时更新文档
  gulp.watch([dirname + '/es/**/*.js'], { events: 'all' }, parallel(es, compileDoc));
  gulp.watch([dirname + '/lib/ellaH5/*.js'], { events: 'all' }, ellaH5);
  cb();
}

/**
 * 
 * html 监听
 */
function reloadHTML() {
  return gulp.src(dirname + '/index.html')
    .pipe(connect.reload())
}
function htmlWatch(cb) {
  gulp.watch([dirname + '/index.html'], { events: 'all' }, reloadHTML);
  cb();
}

/**
 * @description connect 
 * @param {function} cb 成功回调
 */
function connectWatch(cb) {
  connect.server({
    root: '.',
    livereload: true
  });
  cb();
}

/**
 * @description zip code
 */
function zipCode() {
  return gulp.src([`${dirname}/**/*`], {
    nodir: true
  })
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('.'));
}

function zipClean(cb) {
  return del('./dist.zip', cb);
}

function distClean(cb) {
  return del('./dist/**', cb);
}

function compileDoc(cb) {
  let config = require('./.jsdoc.json')
  return gulp.src(['README.MD', `${dirname}/es/**/*.js`], { read: false })
    .pipe(jsdoc(config, cb));
}

exports.default = series(cssClean, jsClean, scss, es, compileDoc, ellaH5, scssWatch, esWatch, htmlWatch, connectWatch);

exports.build = series(cssClean, jsClean, scss, es, ellaH5);

exports.clean = parallel(cssClean, jsClean, zipClean);

exports.zip = series(cssClean, jsClean, scss, es, ellaH5, zipClean, zipCode, distClean);

exports.doc = compileDoc;