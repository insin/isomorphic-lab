'use strict';

require('setimmediate')

var auto = require('run-auto')
var React = require('react')
var Router = require('react-router')

var routes = require('./routes')

var appDiv = document.getElementById('app')

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

Router.run(routes, Router.HistoryLocation, (Handler, state) => {
  fetchData(state.routes, state.params, function(err, data) {
    React.render(<Handler data={data}/>, appDiv)
  })
})