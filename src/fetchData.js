'use strict';

var runAuto = require('run-auto')

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

  runAuto(dataFetchers, cb)
}

module.exports = fetchData