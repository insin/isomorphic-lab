'use strict';

var path = require('path')
var querystring = require('querystring')

var bodyParser = require('body-parser')
var compression = require('compression')
var errorhandler = require('errorhandler')
var express = require('express')
var favicon = require('serve-favicon')
var logger = require('morgan')
var serveStatic = require('serve-static')

var auto = require('run-auto')
var React = require('react')
var Router = require('react-router')

var app = express()
var pkg = require('../package.json')
var {ThingForm} = require('./forms')
var routes = require('./routes')

app.set('host', process.env.HOST || '127.0.0.1')
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, '../views'))
app.use(logger('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(compression())
app.use(favicon(path.join(__dirname, '../static/favicon.ico')))
app.use(serveStatic(path.join(__dirname, '../static')))

var THINGS = [
  {name: 'First thing', price: '42.42', description: 'The very first thing'}
]

app.get('/api/things', (req, res, next) => {
  res.json(THINGS)
})

app.post('/api/addthing', (req, res, next) => {
  var form = new ThingForm({data: req.body})
  if (form.isValid()) {
    THINGS.push(form.cleanedData)
    res.status(200).end()
  }
  else {
    res.status(400).json(form.errors().toJSON())
  }
})

function fetchData(routes, params, cb) {
  var fetchDataRoutes = routes.filter(route => route.handler.fetchData)
  if (fetchDataRoutes.length === 0) {
    return cb(null, {})
  }

  var dataFetchers = {}
  fetchDataRoutes.forEach(route => {
    var fetcher = route.handler.fetchData
    if (fetcher.length == 2) {
      fetcher = fetcher.bind(null, params)
    }
    dataFetchers[route.name] = fetcher
  })

  auto(dataFetchers, cb)
}

function renderApp(url, cb) {
  var router = Router.create({
    routes: routes
  , location: url
  , onAbort: cb
  })

  router.run((Handler, state) => {
    fetchData(state.routes, state.params, (err, data) => {
      var html = React.renderToString(<Handler data={data}/>)
      cb(null, html, JSON.stringify(data))
    })
  })
}

app.use((req, res, next) => {
  var url = req.url
  if (req.method == 'POST') {
    url += `?_method=${req.method}&${querystring.stringify(req.body)}`
  }

  renderApp(url, (redirect, html, data) => {
    console.log(arguments)
    if (redirect) {
      res.redirect(303, redirect.to)
    }
    else {
      res.render('react.jade', {html: html, data: data})
    }
  })
})

if ('development' == app.get('env')) {
  app.use(errorhandler())
}

app.listen(app.get('port'), app.get('host'), () => {
  console.log(pkg.name + ' server listening on http://' + app.get('host') +
              ':' + app.get('port'))
})