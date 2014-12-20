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
var session = require('express-session')

var assign = require('react/lib/Object.assign')
var forms = require('newforms')
var React = require('react')
var Router = require('react-router')
var Redirect = require('react-router/modules/utils/Redirect')

var app = express()
var pkg = require('../package.json')
var fetchData = require('./fetchData')
var {ThingForm} = require('./forms')
var Render = require('./Render')
var routes = require('./routes')

app.set('host', process.env.HOST || '0.0.0.0')
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, '../views'))
app.use(logger('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(compression())
app.use(favicon(path.join(__dirname, '../static/favicon.ico')))
app.use(serveStatic(path.join(__dirname, '../static')))
app.use(session({secret: process.env.SECRET, resave: false, saveUninitialized: true}))

var THINGS = [
  {name: 'First thing', price: '42.42', description: 'The very first thing'}
]

app.get('/api/things', (req, res, next) => {
  res.json(THINGS)
})

app.post('/api/addthing', (req, res, next) => {
  var form = new ThingForm({data: req.body})
  // Extra validation to test display of server-only validation errors
  form.cleanName = function() {
    if (this.cleanedData.name == 'First thing') {
      throw forms.ValidationError('This is a reserved name - please choose another.')
    }
  }
  if (form.isValid()) {
    THINGS.push(form.cleanedData)
    res.sendStatus(200)
  }
  else {
    res.status(400).json(form.errors())
  }
})

function renderApp(location, extraProps, cb) {
  var router = Router.create({
    location,
    routes,

    onAbort(reason) {
      if (reason instanceof Error) {
        cb(reason)
      }
      else if (reason instanceof Redirect) {
        cb(null, {redirect: reason})
      }
      else if (reason instanceof Render) {
        cb(null, {render: reason})
      }
      else {
        cb(null, reason)
      }
    },

    onError(err) {
      cb(err)
    }
  })

  router.run((Handler, state) => {
    if (state.routes[0].name == 'notfound') {
      var html = React.renderToStaticMarkup(<Handler/>)
      return cb(null, {notFound: true}, html)
    }
    fetchData(state.routes, state.params, (err, props) => {
      if (extraProps) {
        assign(props, extraProps)
      }
      var html = React.renderToString(<Handler {...props}/>)
      cb(null, null, html, JSON.stringify(props))
    })
  })
}

function renderAppHandler(res, next, err, special, html, props) {
  if (err) {
    return next(err)
  }

  if (!special) {
    return res.render('react.jade', {html, props})
  }

  if (special.notFound) {
    res.status(404).render('base.jade', {title: 'Not Found', html})
  }
  else if (special.redirect) {
    res.redirect(303, special.redirect.to)
  }
  else if (special.render) {
    var {url, extraProps} = special.render
    renderApp(url, extraProps, renderAppHandler.bind(null, res, next))
  }
  else {
    console.error('Unexpected special response case: ', special)
    next(new Error('Unexpected special response case'))
  }
}

app.use((req, res, next) => {
  var url = req.url
  // Use query params to pass POST data to willTransitionTo
  if (req.method == 'POST') {
    url += `?_method=${req.method}&${querystring.stringify(req.body)}`
  }
  renderApp(url, null, renderAppHandler.bind(null, res, next))
})

if ('development' == app.get('env')) {
  app.use(errorhandler())
}

app.listen(app.get('port'), app.get('host'), () => {
  console.log(
    `${pkg.name} server listening on http://${app.get('host')}:${app.get('port')}`
  )
})