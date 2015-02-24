'use strict';

var React = require('react')
var superagent = require('superagent')

var Section = require('./components/Section')

var {FORUM_API_URL} = require('../constants')

var Sections = React.createClass({
  statics: {
    title: 'Sections',

    fetchData(params, cb) {
      superagent.get(`${FORUM_API_URL}/sections`).end(function(err, res) {
        cb(err, res && {sections: res.body})
      })
    }
  },

  render() {
    var {sections} = this.props.data
    return <div className="Sections">
      {sections.map(section => <Section {...section}/>)}
    </div>
  }
})

module.exports = Sections