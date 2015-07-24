'use strict';

var React = require('react')
var superagent = require('superagent-ls')

var Section = require('./components/Section')

var {FORUM_API_URL} = require('../constants')

var Sections = React.createClass({
  statics: {
    title: 'Sections',

    loadProps(params, cb) {
      superagent.get(`${FORUM_API_URL}/sections`).end((err, res) => {
        cb(err, res && {sections: res.body})
      })
    }
  },

  render() {
    var {sections} = this.props
    return <div className="Sections">
      {sections.map(section => <Section {...section}/>)}
    </div>
  }
})

module.exports = Sections
