'use strict';

var {RenderForm} = require('newforms')
var React = require('react')
var {Link, RouteHandler} = require('react-router')
var superagent = require('superagent')
var promiseagent = require('superagent-promise')

var {ThingForm} = require('./forms')

var HOST = process.env.HOST
var PORT = process.env.PORT
var BASE_URL = `http://${HOST}:${PORT}`

var App = React.createClass({
  _testClick() {
    alert('Events registered!')
  },

  render() {
    return <div className="App" >
      <h1><Link to="home">App</Link> <small onClick={this._testClick}>click me to check events</small></h1>
      <Link to="things">List Things</Link>
      <RouteHandler data={this.props.data}/>
    </div>
  }
})

var Things = React.createClass({
  statics: {
    fetchData(cb) {
      superagent.get(`${BASE_URL}/api/things`).accept('json').end(function(err, res) {
        cb(err, res && res.body)
      })
    }
  },

  getDefaultProps() {
    return {
      data: {}
    }
  },

  render() {
    var {things} = this.props.data
    return <div className="Things">
      <h2>Things</h2>
      {things && things.map(thing => <div className="Thing__thing">
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

var AddThing = React.createClass({
  statics: {
    willTransitionTo(transition, params, query) {
      if (query._method == 'POST') {
        transition.wait(
          promiseagent.post(`${BASE_URL}/api/addthing`).type('json').send(query).end().then(res => {
            if (res.serverError) {
              console.error(`Server error: ${res.body}`)
              // TODO Redisplay with server error + original user input
            }
            else if (res.clientError) {
              console.error(`Validation errors: ${res.body}`)
              // TODO Redisplay with validation errors + original user input
            }
            else if (res.ok) {
              transition.redirect('/things')
            }
          })
        )
      }
    }
  },

  render() {
    return <div className="AddThing">
      <h2>Add Thing</h2>
      <form action="/addthing" method="POST">
        <RenderForm form={ThingForm}/>
        <button>Submit</button> or <Link to="things">Cancel</Link>
      </form>
    </div>
  }
})

module.exports = {
  App
, Things
, AddThing
}