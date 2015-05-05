'use strict';

var React = require('react')
var {RouteHandler} = require('@insin/react-router')

var Forums = React.createClass({
  statics: {
    title: 'Forums'
  },

  render() {
    return <div className="Forums">
      <RouteHandler {...this.props}/>
    </div>
  }
})

module.exports = Forums