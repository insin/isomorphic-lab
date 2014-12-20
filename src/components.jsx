'use strict';

var querystring = require('querystring')

var {ErrorObject, RenderForm} = require('newforms')
var React = require('react')
var {Link, Navigation, RouteHandler} = require('react-router')
var superagent = require('superagent')
var promiseagent = require('superagent-promise')

var env = require('./env')
var events = require('./events')
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
      <RouteHandler {...this.props}/>
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
    ERRORS_EVENT: 'AddThing:errors',

    willTransitionTo(transition, params, query) {
      if (query._method != 'POST') { return }
      delete query._method

      transition.wait(promiseagent.post(`${BASE_URL}/api/addthing`).send(query).end().then(res => {
        if (res.serverError) {
          throw new Error(`Server error: ${res.body}`)
        }

        if (res.clientError) {
          if (env.CLIENT) {
            // Update the form with validation errors received from the API
            events.emit(AddThing.ERRORS_EVENT, ErrorObject.fromJSON(res.body))
            transition.abort()
          }
          else {
            // Re-render with user input + validation errors from the API
            transition.abort(new Render('/addthing', {
              initialData: query
            , initialErrors: res.body
            }))
          }
        }
        else if (res.ok) {
          transition.redirect('/things')
        }
      }))
    }
  },

  getDefaultProps() {
    return {
      initialData: null
    , initialErrors: null
    }
  },

  componentWillMount: function() {
    if (this.props.initialErrors) {
      this.initialErrors = ErrorObject.fromJSON(this.props.initialErrors)
    }
  },

  componentDidMount() {
    events.on(AddThing.ERRORS_EVENT, this._onErrors)
  },

  componentWillUnmount() {
    events.removeListener(AddThing.ERRORS_EVENT, this._onErrors)
  },

  _onSubmit(e) {
    e.preventDefault()
    var form = this.refs.thingForm.getForm()
    if (form.validate(this.refs.form)) {
      this.transitionTo(`/addthing?_method=POST&${querystring.stringify(form.data)}`)
    }
  },

  _onErrors(errors) {
    this.refs.thingForm.getForm().setErrors(errors)
  },

  render() {
    return <div className="AddThing">
      <h2>Add Thing</h2>
      <form action="/addthing" method="POST" onSubmit={this._onSubmit} ref="form">
        <RenderForm form={ThingForm} ref="thingForm"
          data={this.props.initialData}
          errors={this.initialErrors}
        />
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