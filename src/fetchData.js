'use strict';

var runAuto = require('run-auto')

var env = require('./env')

function fetchData(routes, params, cb) {
  if (env.CLIENT && typeof window.__DATA__ != 'undefined') {
    var data = window.__DATA__
    delete window.__DATA__
    return cb(null, data)
  }

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

  runAuto(dataFetchers, cb)
}

module.exports = fetchData