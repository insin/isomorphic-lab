'use strict';

var {EventEmitter} = require('events')
var querystring = require('querystring')

var assign = require('react/lib/Object.assign')
var {ErrorObject, RenderForm} = require('newforms')
var React = require('react')
var {Link, Navigation, RouteHandler} = require('react-router')
var superagent = require('superagent')
var promiseagent = require('superagent-promise')

var env = require('./env')
var {ThingForm} = require('./forms')
var Render = require('./Render')

var HOST = process.env.HOST
var PORT = process.env.PORT
var BASE_URL = `http://${HOST}:${PORT}`

var NotFound = React.createClass({
  render() {
    return <div className="NotFound">
      <h2>Not Found</h2>
    </div>
  }
})

var App = React.createClass({
  _testClick() {
    alert('Events registered!')
  },

  render() {
    return <div className="App" >
      <h1><Link to="home">App</Link> <small onClick={this._testClick}>click me to check events</small></h1>
      <Link to="things">Things</Link>
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
  mixins: [Navigation],

  statics: {
    eventEmitter: new EventEmitter(),

    willTransitionTo(transition, params, query) {
      if (query._method == 'POST') {
        transition.wait(
          promiseagent.post(`${BASE_URL}/api/addthing`).type('json').send(query).end().then(res => {
            if (res.serverError) {
              console.error(`Server error: ${res.body}`)
              // TODO Redisplay with server error + original user input
            }
            else if (res.clientError) {
              // Re-render the form with user input + validation errors received
              // from the API.
              if (env.CLIENT) {
                transition.abort()
                AddThing.eventEmitter.emit('errors', res.body)
              }
              else {
                var redisplayData = {
                  _data: assign({}, query)
                , _errors: res.body
                }
                delete redisplayData._data._method
                transition.abort(new Render('/addthing', redisplayData))
              }
            }
            else if (res.ok) {
              transition.redirect('/things')
            }
          })
        )
      }
    }
  },

  getInitialState() {
    var {_data, _errors} = this.props.data
    var form = new ThingForm({
      onChange: () => this.forceUpdate()
    , data: _data || null
    })
    // TODO Add public newforms API for this
    if (_errors) {
      form._errors = ErrorObject.fromJSON(_errors)
    }
    return {
      form: form
    }
  },

  componentDidMount() {
    AddThing.eventEmitter.on('errors', this._onErrors)
  },

  componentWillUnmount() {
    AddThing.eventEmitter.removeListener('errors', this._onErrors)
  },

  _onSubmit(e) {
    e.preventDefault()
    var form = this.refs.thingForm.getForm()
    if (form.validate(this.refs.form)) {
      this.transitionTo(`/addthing?_method=POST&${querystring.stringify(form.data)}`)
    }
  },

  _onErrors(errors) {
    // TODO Add public newforms API for this
    var form = this.refs.thingForm.getForm()
    form._errors = ErrorObject.fromJSON(errors)
    this.forceUpdate()
  },

  // TODO Add support for for setting predetermined errors in RenderForm -
  //      wouldn't need getInitialState() at all then.
  render() {
    return <div className="AddThing">
      <h2>Add Thing</h2>
      <form action="/addthing" method="POST" onSubmit={this._onSubmit} ref="form">
        <RenderForm form={this.state.form} ref="thingForm"/>
        <button>Submit</button> or <Link to="things">Cancel</Link>
      </form>
    </div>
  }
})

module.exports = {
  AddThing
, App
, NotFound
, Things
}