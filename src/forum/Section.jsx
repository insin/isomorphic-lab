'use strict';

var React = require('react')
var {Link} = require('react-router')
var superagent = require('superagent')

var SectionForum = require('./components/SectionForum')

var {FORUM_API_URL} = require('../constants')

var Section = React.createClass({
  statics: {
    getTitle(props, params) {
      return props.data.section.name
    },

    fetchData(params, cb) {
      superagent.get(`${FORUM_API_URL}/section/${params.id}`).end((err, res) => {
        cb(err, res && {section: res.body})
      })
    }
  },

  render() {
    var {id, name, forums} = this.props.data.section
    return <div className="Section">
      <div className="Breadcrumbs">
        <Link to="forums">Forums</Link>
        {' → '}
        <Link to="section" params={{id}}>{name}</Link>
      </div>
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