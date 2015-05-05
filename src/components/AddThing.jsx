'use strict';

var {ErrorObject, RenderForm} = require('newforms')
var React = require('react')
var {Link, Navigation} = require('@insin/react-router')
var superagent = require('superagent-ls')

var Validating = require('./Validating')
var {API_URL} = require('../constants')
var {ThingForm} = require('../forms')

var AddThing = React.createClass({
  mixins: [Navigation],

  propTypes: {
    data: React.PropTypes.object,
    errors: React.PropTypes.object
  },

  statics: {
    title: 'Add Thing',

    willTransitionTo(transition, params, query, cb, req) {
      if (req.method != 'POST') { return cb() }

      superagent.post(`${API_URL}/things`).send(req.body).end((err, res) => {
        if (err || res.serverError) {
          return cb(err || new Error(`Server error: ${res.body}`))
        }

        if (res.clientError) {
          transition.redirect('addThing', {}, {}, {
            data: req.body,
            errors: res.body
          })
        }
        else {
          transition.redirect('things')
        }
        cb()
      })
    }
  },

  getInitialState() {
    return {
      client: false
    }
  },

  componentDidMount() {
    this.setState({client: true})
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      var errorObject = this._getErrorObject(nextProps.errors)
      this.refs.thingForm.getForm().setErrors(errorObject)
    }
  },

  _getErrorObject(errors) {
    if (!errors) { errors = this.props.errors }
    return errors ? ErrorObject.fromJSON(errors) : null
  },

  _onSubmit(e) {
    e.preventDefault()
    var form = this.refs.thingForm.getForm()
    form.validate(this.refs.form, (err, isValid) => {
      if (isValid) {
        this.transitionTo('addThing', {}, {}, {
          method: 'POST',
          body: form.data
        })
      }
    })
  },

  render() {
    return <div className="AddThing">
      <h2>Add Thing</h2>
      <form action={this.makeHref('addThing')} method="POST" onSubmit={this._onSubmit} ref="form" autoComplete="off" noValidate={this.state.client}>
        <RenderForm form={ThingForm} ref="thingForm"
          data={this.props.data}
          errors={this._getErrorObject()}
          progress={Validating}
        />
        <button>Submit</button> or <Link to="things">Cancel</Link>
      </form>
    </div>
  }
})

module.exports = AddThing