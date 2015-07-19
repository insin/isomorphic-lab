'use strict';

var React = require('react')
var {Link} = require('react-router')

var pluralise = require('../../utils/pluralise')

var ForumTopic = React.createClass({
  render() {
    var {id, title, posts} = this.props
    return <tr>
      <td><Link to={`/forums/topic/${id}`}>{title}</Link></td>
      <td><strong>{posts}</strong> post{pluralise(posts)}</td>
    </tr>
  }
})

module.exports = ForumTopic
