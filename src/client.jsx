'use strict';

var React = require('react')
var {Router, Route} = require('react-router')
var {history} = require('react-router/lib/BrowserHistory')
// XXX
var AsyncProps = require('react-router/lib/experimental/AsyncProps').default

var getTitle = require('./utils/getTitle')
var routes = require('./routes')

function onUpdate() {
  console.log('onUpdate', this.state)
}

AsyncProps.rehydrate(window.__PROPS__)

React.render(
  <Router history={history} createElement={AsyncProps.createElement} onUpdate={onUpdate}>
    <Route component={AsyncProps}>
      {routes}
    </Route>
  </Router>,
  document.getElementById('app')
)
