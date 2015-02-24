'use strict';

var assign = require('react/lib/Object.assign')
var runParallel = require('run-parallel')

var env = require('./env')

function fetchData(routes, params, cb) {
  if (env.CLIENT && typeof window.__PROPS__ != 'undefined') {
    var props = window.__PROPS__
    delete window.__PROPS__
    return cb(null, props)
  }

  var fetchDataRoutes = routes.filter(route => route.handler.fetchData)
  if (fetchDataRoutes.length === 0) {
    return cb(null, {})
  }

  var dataFetchers = fetchDataRoutes.map(route => {
    var fetcher = route.handler.fetchData
    if (fetcher.length == 2) {
      fetcher = fetcher.bind(null, params)
    }
    return fetcher
  })

  runParallel(dataFetchers, function(err, data) {
    cb(err, {data: assign.apply(null, data)})
  })
}

module.exports = fetchData