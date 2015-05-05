'use strict';

var React = require('react')
var {Link} = require('@insin/react-router')

var ForumTopic = React.createClass({
  render() {
    var {id, title, posts} = this.props
    return <tr>
      <td><Link to="topic" params={{id}}>{title}</Link></td>
      <td><strong>{posts}</strong> posts</td>
    </tr>
  }
})

module.exports = ForumTopic