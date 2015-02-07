'use strict';

var React = require('react')
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
    var {name, description, subforums, topics} = this.props.data.forum
    return <div className="Forum">
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
      <table>
        <tbody>
          {topics.map(topic => <ForumTopic {...topic}/>)}
        </tbody>
      </table>
    </div>
  }
})

module.exports = Forum