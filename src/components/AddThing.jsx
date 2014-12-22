'use strict';

var assign = require('react/lib/Object.assign')
var {ErrorObject, RenderForm} = require('newforms')
var React = require('react')
var {Link, Navigation} = require('react-router')
var promiseAgent = require('superagent-promise')

var Title = require('./DocumentTitle')
var {BASE_URL} = require('../constants')
var {ThingForm} = require('../forms')
var env = require('../utils/env')
var events = require('../utils/events')
var Render = require('../utils/Render')

var AddThing = React.createClass({
  mixins: [Navigation],

  statics: {
    ERRORS_EVENT: 'AddThing:errors',

    willTransitionTo(transition, params, query) {
      if (query._method != 'POST') { return }
      delete query._method

      transition.wait(promiseAgent.post(`${BASE_URL}/api/addthing`).send(query).end().then(res => {
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
      this.transitionTo('/addthing', {}, assign({_method: 'POST'}, form.data))
    }
  },

  _onErrors(errors) {
    this.refs.thingForm.getForm().setErrors(errors)
  },

  render() {
    return <div className="AddThing">
      <Title title="Add Thing"/>
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

module.exports = AddThing