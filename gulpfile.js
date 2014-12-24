var browserify = require('browserify')
var gulp = require('gulp')
var gutil = require('gulp-util')
var jshint = require('gulp-jshint')
var nodemon = require('gulp-nodemon')
var plumber = require('gulp-plumber')
var react = require('gulp-react')
var source = require('vinyl-source-stream')
var streamify = require('gulp-streamify')
var uglify = require('gulp-uglify')

var jsSrcPaths = './src/**/*.js*'
var jsLibPaths = './lib/**/*.js'

process.env.NODE_ENV = gutil.env.production ? 'production' : 'development'
process.env.HOST = '127.0.0.1'
process.env.PORT = '3000'

gulp.task('transpile-js', function() {
  return gulp.src(jsSrcPaths)
    .pipe(plumber())
    .pipe(react({harmony: true}))
    .pipe(gulp.dest('./lib'))
})

gulp.task('lint-js', ['transpile-js'], function() {
  return gulp.src(jsLibPaths)
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
})

gulp.task('bundle-js', ['lint-js'], function() {
  var b = browserify('./lib/client.js', {
    debug: !!gutil.env.debug
  , detectGlobals: false
  })
  b.external('events')
  b.external('react/addons')
  b.external('react')
  b.external('react-router')
  b.external('superagent')
  b.external('superagent-promise')
  b.external('newforms')
  b.external('run-auto')
  b.transform('envify')

  var stream = b.bundle()
    .pipe(source('app.js'))

  if (gutil.env.production) {
    stream = stream.pipe(streamify(uglify()))
  }

  return stream.pipe(gulp.dest('./static/js'))
})

gulp.task('bundle-deps', function() {
  var b = browserify({
    debug: !!gutil.env.debug
  , detectGlobals: false
  })
  b.require('events')
  b.require('react/addons')
  b.require('react/addons', {expose: 'react'})
  b.require('react-router')
  b.require('superagent')
  b.require('superagent-promise')
  b.require('newforms')
  b.require('run-auto')
  b.transform('envify')

  var stream = b.bundle()
    .pipe(source('deps.js'))

  if (gutil.env.production) {
    stream = stream.pipe(streamify(uglify()))
  }

  return stream.pipe(gulp.dest('./static/js'))
})

gulp.task('bundle', ['bundle-deps', 'bundle-js'])

gulp.task('server', function(cb) {
  nodemon({
    script: './lib/server.js'
  , ignore: ['./src/*', './static/*']
  , ext: 'jade js'
  , delay: 5
  })
  cb()
})

gulp.task('watch', function() {
  gulp.watch(jsSrcPaths, ['bundle-js'])
})

gulp.task('default', ['bundle-js', 'watch'])