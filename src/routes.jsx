'use strict';

var React = require('react')
var {DefaultRoute, NotFoundRoute, Route} = require('react-router')

module.exports = [
  <Route path="/" handler={require('./components/App')}>
    <DefaultRoute name="home" handler={require('./components/Home')}/>
    <Route name="things" handler={require('./components/Things')}/>
    <Route name="thing" path="/thing/:num" handler={require('./components/Thing')}/>
    <Route name="addthing" handler={require('./components/AddThing')}/>
  </Route>,
  <NotFoundRoute name="notfound" handler={require('./components/NotFound')}/>
]