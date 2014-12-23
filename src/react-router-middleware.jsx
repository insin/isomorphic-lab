'use strict';

var querystring = require('querystring')

var assign = require('react/lib/Object.assign')
var React = require('react')
var Router = require('react-router')
var Redirect = require('react-router/modules/utils/Redirect')

var fetchData = require('./utils/fetchData')
var getTitle = require('./utils/getTitle')
var Render = require('./utils/Render')

module.exports = function(routes, options) {
  if (!routes) {
    throw new Error('Routes must be provided')
  }
  options = assign({title: {}}, options)

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
        var title = getTitle(state.routes, {}, {})
        return cb(null, {notFound: true}, html, null, title)
      }
      fetchData(state.routes, state.params, (err, props) => {
        if (extraProps) {
          assign(props, extraProps)
        }
        var html = React.renderToString(<Handler {...props}/>)
        var title = getTitle(state.routes, state.params, props, options.title)
        cb(null, null, html, JSON.stringify(props), title)
      })
    })
  }

  function renderAppHandler(res, next, err, special, html, props, title) {
    if (err) {
      return next(err)
    }

    if (!special) {
      return res.render('react', {title, html, props})
    }

    if (special.notFound) {
      res.status(404).render('react-404', {title, html})
    }
    else if (special.redirect) {
      res.redirect(303, special.redirect.to)
    }
    else if (special.render) {
      var {url, extraProps} = special.render
      renderApp(url, extraProps, renderAppHandler.bind(null, res, next))
    }
    else {
      console.error('Unexpected special response case: ', special.constructor, special)
      next(new Error('Unexpected special response case, see server logs.'))
    }
  }

  return function reactRouter(req, res, next) {
    var url = req.url
    // Use query params to pass POST data to willTransitionTo
    if (req.method == 'POST') {
      url += `?_method=${req.method}&${querystring.stringify(req.body)}`
    }
    renderApp(url, null, renderAppHandler.bind(null, res, next))
  }
}