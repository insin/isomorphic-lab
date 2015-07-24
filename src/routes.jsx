'use strict';

var React = require('react')
var {Route} = require('react-router')

var App = require('./components/App')
var Home = require('./components/Home')
var Things = require('./components/Things')
var Thing = require('./components/Thing')
var AddThing = require('./components/AddThing')
var Forums = require('./forum/Forums')
var Sections = require('./forum/Sections')
var Section = require('./forum/Section')
var AddTopic = require('./forum/AddTopic')
var Forum = require('./forum/Forum')
var AddReply = require('./forum/AddReply')
var Topic = require('./forum/Topic')
var NotFound = require('./components/NotFound')

module.exports = <Route component={App}>
  <Route path="/" component={Home}/>
  <Route path="/things" component={Things}/>
  <Route path="/thing/:num" component={Thing}/>
  <Route path="/add-thing" component={AddThing} onEnter={AddThing.onEnter}/>
  <Route component={Forums}>
    <Route path="/forums" component={Sections}/>
    <Route path="/forums/section/:id" component={Section}/>
    <Route path="/forums/forum/:id/add-topic" component={AddTopic} onEnter={AddTopic.onEnter}/>
    <Route path="/forums/forum/:id" component={Forum}/>
    <Route path="/forums/topic/:id/add-reply" component={AddReply} onEnter={AddReply.onEnter}/>
    <Route path="/forums/topic/:id" component={Topic}/>
  </Route>
  <Route path="*" component={NotFound}/>
</Route>
