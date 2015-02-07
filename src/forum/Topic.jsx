'use strict';

var React = require('react')
var {Link} = require('react-router')
var superagent = require('superagent')

var Post = require('./components/Post')

var {FORUM_API_URL} = require('../constants')

var Topic = React.createClass({
  statics: {
    getTitle(props, params) {
      return props.data.topic.title
    },

    fetchData(params, cb) {
      superagent.get(`${FORUM_API_URL}/topic/${params.id}`).end(function(err, res) {
        cb(err, res && res.body)
      })
    }
  },

  render() {
    var {title, posts, forum, section} = this.props.data.topic
    return <div className="Topic">
      <div className="Breadcrumbs">
        <Link to="section" params={{id: section.id}}>{section.name}</Link>
        {' → '}
        <Link to="forum" params={{id: forum.id}}>{forum.name}</Link>
      </div>
      <h2>{title}</h2>
      {posts.map(post => <Post {...post}/>)}
    </div>
  }
})

module.exports = Topic