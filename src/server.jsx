'use strict';

var path = require('path')

var bodyParser = require('body-parser')
var compression = require('compression')
var errorhandler = require('errorhandler')
var express = require('express')
var favicon = require('serve-favicon')
var logger = require('morgan')
var serveStatic = require('serve-static')

var pkg = require('../package.json')
var reactRouter = require('./react-router-middleware')

var app = express()
app.set('host', process.env.HOST || '0.0.0.0')
app.set('port', process.env.PORT || 3000)
app.set('view engine', 'jade')
app.set('views', path.join(__dirname, '../views'))
app.use(logger('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(compression())
app.use(favicon(path.join(__dirname, '../static/favicon.ico')))
app.use(serveStatic(path.join(__dirname, '../static')))

app.use('/api', require('./api'))
app.use('/forum-api', require('./forum-api'))

app.use(reactRouter(require('./routes')))

if ('development' == app.get('env')) {
  app.use(errorhandler())
}

app.listen(app.get('port'), app.get('host'), () => {
  console.log(
    `${pkg.name} server listening on http://${app.get('host')}:${app.get('port')}`
  )
})
