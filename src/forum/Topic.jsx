'use strict';

var React = require('react')
var {Link} = require('react-router')
var superagent = require('superagent-ls')

var Post = require('./components/Post')

var {FORUM_API_URL} = require('../constants')

var Topic = React.createClass({
  statics: {
    getTitle(props, params) {
      return `${props.data.topic.title} · ${props.data.topic.forum.name}`
    },

    fetchData(params, cb) {
      superagent.get(`${FORUM_API_URL}/topic/${params.id}`).end((err, res) => {
        cb(err, res && {topic: res.body})
      })
    }
  },

  render() {
    var {id, title, posts, forum, section} = this.props.data.topic
    return <div className="Topic">
      <div className="Breadcrumbs">
        <Link to="forums">Forums</Link>
        {' → '}
        <Link to="section" params={{id: section.id}}>{section.name}</Link>
        {' → '}
        <Link to="forum" params={{id: forum.id}}>{forum.name}</Link>
      </div>
      <h2>{title}</h2>
      <div className="Topic__controls">
        <Link to="addReply" params={{id}}>Reply to this topic</Link>
      </div>
      {posts.map(post => <Post {...post}/>)}
    </div>
  }
})

module.exports = Topic