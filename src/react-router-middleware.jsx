'use strict';

var React = require('react')
var assign = require('react/lib/Object.assign')
var Router = require('react-router')
var Redirect = require('react-router/lib/Redirect')

var {StaticLocation} = Router

var fetchData = require('./utils/fetchData')
var getTitle = require('./utils/getTitle')

module.exports = function(routes, options) {
  if (!routes) {
    throw new Error('Routes must be provided')
  }
  options = assign({title: {}}, options)

  function renderApp(location, cb) {
    var router = Router.create({
      location,
      routes,

      onAbort(reason) {
        if (reason instanceof Error) {
          cb(reason)
        }
        else if (reason instanceof Redirect) {
          cb(null, router, {redirect: reason})
        }
        else {
          cb(null, router, reason)
        }
      },

      onError(err) {
        cb(err)
      }
    })

    router.run((Handler, state) => {
      if (state.routes[0].name == 'notFound') {
        var html = React.renderToStaticMarkup(<Handler/>)
        var title = getTitle(state.routes, {}, {})
        return cb(null, router, {notFound: true}, html, null, title)
      }
      fetchData(state.routes, state.params, (err, fetchedData) => {
        var props = assign({}, fetchedData, state.data)
        var html = React.renderToString(<Handler {...props}/>)
        var title = getTitle(state.routes, state.params, props, options.title)
        cb(null, router, null, html, JSON.stringify(props), title)
      })
    })
  }

  function renderAppHandler(res, next, err, router, special, html, props, title) { // ಠ_ಠ
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
      var redirect = special.redirect
      var path = router.makePath(redirect.to, redirect.params, redirect.query)
      // Rather than introducing a server-specific abort reason object, use the
      // fact that a redirect has a data property as an indication that a
      // response should be rendered directly.
      if (redirect.data) {
        renderApp(
          new StaticLocation(path, redirect.data),
          renderAppHandler.bind(null, res, next)
        )
      }
      else {
        res.redirect(303, path)
      }
    }
    else {
      console.error('Unexpected special response case: ', special.constructor, special)
      next(new Error('Unexpected special response case, see server logs.'))
    }
  }

  return function reactRouter(req, res, next) {
    // Provide the method and body of non-GET requests as a request-like object
    var data = null
    if (req.method != 'GET') {
      data = {method: req.method, body: req.body}
    }
    var location = new StaticLocation(req.url, data)
    renderApp(location, renderAppHandler.bind(null, res, next))
  }
}