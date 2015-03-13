'use strict';

var assign = require('react/lib/Object.assign')
var {ErrorObject, RenderForm} = require('newforms')
var React = require('react')
var {Link, Navigation} = require('react-router')
var superagent = require('superagent')

var Validating = require('./Validating')
var {API_URL} = require('../constants')
var {ThingForm} = require('../forms')
var env = require('../utils/env')
var events = require('../utils/events')
var Render = require('../utils/Render')

var AddThing = React.createClass({
  mixins: [Navigation],

  statics: {
    ERRORS_EVENT: 'AddThing:errors',

    title: 'Add Thing',

    willTransitionTo(transition, params, query, cb) {
      if (query._method != 'POST') { return cb() }
      delete query._method

      superagent.post(`${API_URL}/things`).send(query).end((err, res) => {
        if (err && (!err.response || err.response.serverError)) { return cb(err) }

        if (res.clientError) {
          if (env.CLIENT) {
            // Update the form with validation errors received from the API
            events.emit(AddThing.ERRORS_EVENT, ErrorObject.fromJSON(res.body))
            transition.abort()
          }
          else {
            // Re-render with user input + validation errors from the API
            transition.abort(new Render('/add-thing', {
              initialData: query
            , initialErrors: res.body
            }))
          }
        }
        else if (res.ok) {
          transition.redirect('/things')
        }
        cb()
      })
    }
  },

  getDefaultProps() {
    return {
      initialData: null
    , initialErrors: null
    }
  },

  getInitialState() {
    return {
      client: false
    }
  },

  componentWillMount: function() {
    if (this.props.initialErrors) {
      this.initialErrors = ErrorObject.fromJSON(this.props.initialErrors)
    }
  },

  componentDidMount() {
    events.on(AddThing.ERRORS_EVENT, this._onErrors)
    this.setState({client: true})
  },

  componentWillUnmount() {
    events.removeListener(AddThing.ERRORS_EVENT, this._onErrors)
  },

  _onSubmit(e) {
    e.preventDefault()
    var form = this.refs.thingForm.getForm()
    form.validate(this.refs.form, (err, isValid) => {
      if (isValid) {
        this.transitionTo('/add-thing', {}, assign({_method: 'POST'}, form.data))
      }
    })
  },

  _onErrors(errors) {
    this.refs.thingForm.getForm().setErrors(errors)
  },

  render() {
    return <div className="AddThing">
      <h2>Add Thing</h2>
      <form action={this.makeHref('addThing')} method="POST" onSubmit={this._onSubmit} ref="form" autoComplete="off" noValidate={this.state.client}>
        <RenderForm form={ThingForm} ref="thingForm"
          data={this.props.initialData}
          errors={this.initialErrors}
          progress={Validating}
        />
        <button>Submit</button> or <Link to="things">Cancel</Link>
      </form>
    </div>
  }
})

module.exports = AddThing