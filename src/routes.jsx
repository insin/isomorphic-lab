'use strict';

var React = require('react')
var {DefaultRoute, NotFoundRoute, Route} = require('react-router')

module.exports = [
  <Route path="/" handler={require('./components/App')}>
    <DefaultRoute name="home" handler={require('./components/Home')}/>
    <Route name="things" handler={require('./components/Things')}/>
    <Route name="thing" path="thing/:num" handler={require('./components/Thing')}/>
    <Route name="addThing" path="add-thing" handler={require('./components/AddThing')}/>
    <Route name="forums" handler={require('./forum/Forums')}>
      <DefaultRoute name="sections" handler={require('./forum/Sections')}/>
      <Route name="section" path="section/:id" handler={require('./forum/Section')}/>
      <Route name="addTopic" path="forum/:id/add-topic" handler={require('./forum/AddTopic')}/>
      <Route name="forum" path="forum/:id" handler={require('./forum/Forum')}/>
      <Route name="addReply" path="topic/:id/add-reply" handler={require('./forum/AddReply')}/>
      <Route name="topic" path="topic/:id" handler={require('./forum/Topic')}/>
    </Route>
  </Route>,
  <NotFoundRoute name="notfound" handler={require('./components/NotFound')}/>
]