'use strict';

var React = require('react')
var {NotFoundRoute, Route} = require('react-router')

module.exports = [
  <Route name="home" path="/" handler={require('./components/App')}>
    <Route name="things" handler={require('./components/Things')}/>
    <Route name="addthing" handler={require('./components/AddThing')}/>
  </Route>,
  <NotFoundRoute name="notfound" handler={require('./components/NotFound')}/>
]