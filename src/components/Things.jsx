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
      <h2>Things</h2>
      {things && things.map((thing, index) => <div className="Things__thing">
        <h3>Thing #{index + 1}</h3>
        <dl>
          <dt>Name:</dt>
          <dd>{thing.name}</dd>
          <dt>Price:</dt>
          <dd>{thing.price}</dd>
          <dt>Description:</dt>
          <dd>{thing.description}</dd>
        </dl>
      </div>)}
      <hr/>
      <Link to="/addthing">Add Thing</Link>
    </div>
  }
})

module.exports = Things