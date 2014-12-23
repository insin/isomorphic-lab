'use strict';

var React = require('react')

var NotFound = React.createClass({
  statics: {
    title: '404 Not Found'
  },

  render() {
    return <div className="NotFound">
      <h2>404 Not Found</h2>
    </div>
  }
})

module.exports = NotFound