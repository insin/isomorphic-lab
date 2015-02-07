'use strict';

var React = require('react')

var Post = React.createClass({
  render() {
    return <div className="Post">
      {this.props.body}
    </div>
  }
})

module.exports = Post