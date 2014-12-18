'use strict';

var React = require('react')
var {Route} = require('react-router')

var {App, Things, AddThing} = require('./components')

module.exports = <Route name="home" path="/" handler={App}>
  <Route name="things" handler={Things}/>
  <Route name="addthing" handler={AddThing}/>
</Route>