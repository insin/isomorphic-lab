'use strict';

var React = require('react')
var {NotFoundRoute, Route} = require('react-router')

var {AddThing, App, NotFound, Things} = require('./components')

module.exports = <Route name="home" path="/" handler={App}>
  <Route name="things" handler={Things}/>
  <Route name="addthing" handler={AddThing}/>
  <NotFoundRoute name="notfound" handler={NotFound}/>
</Route>