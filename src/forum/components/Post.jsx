'use strict';

var React = require('react')

var Post = React.createClass({
  render() {
    return <div className="Post">
      <div className="Post__header">
        <a className="Post__username">Anonymous User</a>
      </div>
      <div className="Post__content">
        <div className="Post__body">{this.props.body}</div>
      </div>
    </div>
  }
})

module.exports = Post