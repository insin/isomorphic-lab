'use strict';

var assign = require('react/lib/Object.assign')
var runParallel = require('run-parallel')

var env = require('./env')

function fetchData(components, params, cb) {
  if (env.CLIENT && typeof window.__PROPS__ != 'undefined') {
    var props = window.__PROPS__
    delete window.__PROPS__
    return cb(null, props)
  }

  var fetchDataComponents = components.filter(component => component.fetchData)
  if (fetchDataComponents.length === 0) {
    return cb(null, {})
  }

  var dataFetchers = fetchDataComponents.map(component => {
    var fetcher = component.fetchData
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
