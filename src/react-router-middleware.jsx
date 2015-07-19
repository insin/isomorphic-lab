'use strict';

var React = require('react')
var assign = require('react/lib/Object.assign')
var {Router} = require('react-router')
var Location = require('react-router/lib/Location')

var fetchData = require('./utils/fetchData')
var getTitle = require('./utils/getTitle')

module.exports = function(routes, options) {
  if (!routes) {
    throw new Error('Routes must be provided')
  }
  options = assign({title: {}}, options)

  function renderApp(location, cb) {
    Router.run(routes, location, (err, state, transition) => {
      if (err) { return cb(err) }

      if (transition.isCancelled) {
        return cb(null, transition)
      }

      fetchData(state.components, state.params, (err, fetchedData) => {
        if (err) { return cb(err) }
        var extraProps = assign({}, fetchedData, state.location.state)
        function createElement(Component, props) {
          return <Component {...extraProps} {...props}/>
        }
        var html = React.renderToString(
          <Router {...state} createElement={createElement}/>
        )
        try {
          var title = getTitle(state.components, state.params, extraProps, options.title)
          cb(null, transition, html, JSON.stringify(extraProps), title)
        }
        catch(err) {
          cb(err)
        }
      })
    })
  }

  function renderAppHandler(res, next, err, transition, html, props, title) { // ಠ_ಠ
    if (err) {
      return next(err)
    }

    if (!transition.isCancelled) {
      return res.render('react', {title, html, props})
    }

    if (transition.redirectInfo) {
      var {pathname, query, state} = transition.redirectInfo
      // Rather than introducing a server-specific abort reason object, use the
      // fact that a redirect has non-URL state as an indication that a response
      // should be rendered directly.
      if (state) {
        renderApp(
          new Location(pathname, query, state),
          renderAppHandler.bind(null, res, next)
        )
      }
      else {
        res.redirect(303, pathname)
      }
    }
    else {
      console.error('Transiton cancelled in an unexpected way: ', transition.abortReason)
      next(new Error('Transiton cancelled in an unexpected way, see server logs.'))
    }
  }

  return function reactRouter(req, res, next) {
    // Provide the method and body of non-GET requests as a request-like object
    var state = null
    if (req.method !== 'GET') {
      state = {method: req.method, body: req.body}
    }
    var location = new Location(req.url, req.query, state)
    renderApp(location, renderAppHandler.bind(null, res, next))
  }
}
