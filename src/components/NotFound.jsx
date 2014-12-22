'use strict';

var React = require('react')

var Title = require('./DocumentTitle')

var NotFound = React.createClass({
  render() {
    return <div className="NotFound">
      <Title title="Not Found"/>
      <h2>Not Found</h2>
    </div>
  }
})

module.exports = NotFound