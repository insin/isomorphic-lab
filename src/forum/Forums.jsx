'use strict';

var React = require('react')

var Forums = React.createClass({
  statics: {
    title: 'Forums'
  },

  render() {
    return <div className="Forums">
      {this.props.children}
    </div>
  }
})

module.exports = Forums
