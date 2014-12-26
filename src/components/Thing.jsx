'use strict';

var React = require('react')
var superagent = require('superagent')

var {API_URL} = require('../constants')

var Thing = React.createClass({
  statics: {
    getTitle(props, params) {
      return `Thing: ${props.data.thing.name}`
    },

    fetchData(params, cb) {
      superagent.get(`${API_URL}/things/${params.num}`).end(function(err, res) {
        // TODO How should 404s be handled?
        cb(err, res && res.body)
      })
    }
  },

  getDefaultProps() {
    return {data: {}}
  },

  render() {
    var {thing} = this.props.data
    if (thing.error) {
      return <h3>Error: {thing.error}</h3>
    }
    return <div className="Thing">
      <h3 className="Thing__name">{thing.name}</h3>
      <div className="Thing__price">
        <strong>&curren;{thing.price.toFixed(2)}</strong>
      </div>
      <div className="Thing__description">
        {thing.description}
      </div>
    </div>
  }
})

module.exports = Thing