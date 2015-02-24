'use strict';

var React = require('react')
var {Link} = require('react-router')
var superagent = require('superagent')

var {API_URL} = require('../constants')

var Things = React.createClass({
  statics: {
    title: 'Things',

    fetchData(cb) {
      superagent.get(`${API_URL}/things`).accept('json').end(function(err, res) {
        cb(err, res && {things: res.body})
      })
    }
  },

  getDefaultProps() {
    return {data: {}}
  },

  render() {
    var {things} = this.props.data
    return <div className="Things">
      <h2>Things <small>(10 most recent)</small></h2>
      {things && things.map((thing, index) => <div className="Thing">
        <h3 className="Thing__name">
          <Link to="thing" params={{num: index + 1}}>{thing.name}</Link>
        </h3>
        <div className="Thing__price">
          <strong>&curren;{thing.price.toFixed(2)}</strong>
        </div>
        <div className="Thing__description">
          {thing.description}
        </div>
      </div>)}
      <hr/>
      <Link to="addthing">Add Thing</Link>
    </div>
  }
})

module.exports = Things