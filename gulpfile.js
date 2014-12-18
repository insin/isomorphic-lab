var browserify = require('browserify')
var gulp = require('gulp')
var gutil = require('gulp-util')
var jshint = require('gulp-jshint')
var nodemon = require('gulp-nodemon')
var plumber = require('gulp-plumber')
var react = require('gulp-react')
var source = require('vinyl-source-stream')

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
  b.transform('envify')

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./static/js'))
})

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