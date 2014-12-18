'use strict';

require('setimmediate')

var React = require('react')
var Router = require('react-router')

var fetchData = require('./fetchData')
var routes = require('./routes')

var appDiv = document.getElementById('app')

Router.run(routes, Router.HistoryLocation, (Handler, state) => {
  fetchData(state.routes, state.params, function(err, data) {
    React.render(<Handler data={data}/>, appDiv)
  })
})