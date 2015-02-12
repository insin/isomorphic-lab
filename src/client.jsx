'use strict';

require('setimmediate')

var React = require('react')
var assign = require('react/lib/Object.assign')
var Router = require('react-router')

var fetchData = require('./utils/fetchData')
var getTitle = require('./utils/getTitle')
var routes = require('./routes')

var appDiv = document.getElementById('app')

Router.run(routes, Router.HistoryLocation, (Handler, state) => {
  fetchData(state.routes, state.params, function(err, fetchedData) {
    var props = assign({}, fetchedData, state.payload)
    React.render(<Handler {...props}/>, appDiv)
    document.title = getTitle(state.routes, state.params, props)
  })
})