'use strict';

var React = require('react')
var {Link} = require('react-router')
var superagent = require('superagent')

var ForumTopic = require('./components/ForumTopic')
var SectionForum = require('./components/SectionForum')

var {FORUM_API_URL} = require('../constants')

var Forum = React.createClass({
  statics: {
    getTitle(props, params) {
      return props.data.forum.name
    },

    fetchData(params, cb) {
      superagent.get(`${FORUM_API_URL}/forum/${params.id}`).end(function(err, res) {
        cb(err, res && res.body)
      })
    }
  },

  render() {
    var {id, name, description, subforums, topics, section} = this.props.data.forum
    return <div className="Forum">
      <div className="Breadcrumbs">
        <Link to="section" params={{id: section.id}}>{section.name}</Link>
        {' → '}
        <Link to="forum" params={{id}}>{name}</Link>
      </div>
      <h2 className="Forum__name">{name}</h2>
      {description && <p className="Forum__description">
        {description}
      </p>}
      {subforums.length > 0 && <table className="Section">
        <caption>Subforums</caption>
        <tbody>
          {subforums.map(forum => <SectionForum {...forum}/>)}
        </tbody>
      </table>}
      <Link to="addTopic" params={{id}}>New Topic</Link>
      <table>
        <tbody>
          {topics.map(topic => <ForumTopic {...topic}/>)}
        </tbody>
      </table>
    </div>
  }
})

module.exports = Forum