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
  uglify = require('gulp-uglify'),
  obfuscator = require('gulp-javascript-obfuscator'),
  zip = require('gulp-zip'),
  gulpif = require('gulp-if');

// sass.compiler = require('node-sass');

// let dirname = "./public/h5/regist/";
const { series, parallel } = require('gulp');
let dirname = ".";
let output = dirname;
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
  let steam = gulp.src(dirname + '/es/**/*.js')
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

/**
 * zip code
 */
function zipCode(cb) {
  return gulp.src([
    `${dirname}/**/*`,
    `!${dirname}/node_modules/**/*`,
    `!${dirname}/.git/**/*`,
    `!${dirname}/assets/**/*`,
    `!${dirname}/dist/**/*`,
    `!${dirname}/es/**/*`,
    `!${dirname}/scss/**/*`,
    `!${dirname}/.babelrc`,
    `!${dirname}/.gitignore`,
    `!${dirname}/gulpfile.js`,
    `!${dirname}/package.json`,
    `!${dirname}/readme.md`,
  ], {
      nodir: true
    })
    .pipe(gulp.dest(output + '/dist'))
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest(output));
}

function zipClean(cb) {
  return del([dirname + '/dist/**', dirname + '/dist.zip'], cb);
}

exports.default = series(cssClean, jsClean, scss, es, scssWatch, esWatch, connectWatch);

exports.build = series(cssClean, jsClean, scss, es);

exports.clean = parallel(cssClean, jsClean);

exports.zip = series(cssClean, jsClean, scss, es, zipClean, zipCode);