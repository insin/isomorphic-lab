'use strict';

var React = require('react')
var superagent = require('superagent')

var SectionForum = require('./components/SectionForum')

var {FORUM_API_URL} = require('../constants')

var Section = React.createClass({
  statics: {
    getTitle(props, params) {
      return props.data.section.name
    },

    fetchData(params, cb) {
      superagent.get(`${FORUM_API_URL}/section/${params.id}`).end(function(err, res) {
        cb(err, res && res.body)
      })
    }
  },

  render() {
    var {name, forums} = this.props.data.section
    return <div className="Section">
      <h2>{name}</h2>
      {forums.length > 0 && <table className="Section">
        <caption>Forums</caption>
        <tbody>
          {forums.map(forum => <SectionForum {...forum}/>)}
        </tbody>
      </table>}
    </div>
  }
})

module.exports = Section