'use strict';

var React = require('react')
var {Link} = require('react-router')
var superagent = require('superagent')

var Title = require('./DocumentTitle')
var {BASE_URL} = require('../constants')

var Things = React.createClass({
  statics: {
    fetchData(cb) {
      superagent.get(`${BASE_URL}/api/things`).accept('json').end(function(err, res) {
        cb(err, res && res.body)
      })
    }
  },

  getDefaultProps() {
    return {data: {}}
  },

  render() {
    var {things} = this.props.data
    return <div className="Things">
      <Title title="Things"/>
      <h2>Things <small>(10 most recent)</small></h2>
      {things && things.map((thing, index) => <div className="Things__thing">
        <h3>{thing.name}</h3>
        <div className="Things__thing-price">
          <strong>&curren;{thing.price.toFixed(2)}</strong>
        </div>
        <div className="Things__thing-description">
          {thing.description}
        </div>
      </div>)}
      <hr/>
      <Link to="/addthing">Add Thing</Link>
    </div>
  }
})

module.exports = Things