'use strict';

var React = require('react')
var {DefaultRoute, NotFoundRoute, Route} = require('react-router')

module.exports = [
  <Route path="/" handler={require('./components/App')}>
    <DefaultRoute name="home" handler={require('./components/Home')}/>
    <Route name="things" handler={require('./components/Things')}/>
    <Route name="thing" path="/thing/:num" handler={require('./components/Thing')}/>
    <Route name="addthing" handler={require('./components/AddThing')}/>
    <Route name="forums" path="/forums" handler={require('./forum/Forums')}>
      <DefaultRoute name="sections" handler={require('./forum/Sections')}/>
      <Route name="forum" path="forum/:id" handler={require('./forum/Forum')}/>
      <Route name="topic" path="topic/:id" handler={require('./forum/Topic')}/>
    </Route>
  </Route>,
  <NotFoundRoute name="notfound" handler={require('./components/NotFound')}/>
]