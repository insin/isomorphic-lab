'use strict';

var {ErrorObject, RenderForm} = require('newforms')
var React = require('react')
var {Link, Navigation} = require('react-router')
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

    onEnter(routerState, transition, cb) {
      var req = routerState.location.state
      if (!req || req.method !== 'POST') { return cb() }

      superagent.post(`${API_URL}/things`).send(req.body).end((err, res) => {
        if (err || res.serverError) {
          return cb(err || new Error(`Server error: ${res.body}`))
        }

        if (res.clientError) {
          transition.to('/add-thing', null, {
            data: req.body,
            errors: res.body
          })
        }
        else {
          transition.to('/things')
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
    if (nextProps.location.state && nextProps.location.state.errors) {
      var errorObject = this._getErrorObject(nextProps)
      this.refs.thingForm.getForm().setErrors(errorObject)
    }
  },

  _getErrorObject(props) {
    var state = (props ? props.location : this.props.location).state
    return state && state.errors ? ErrorObject.fromJSON(state.errors) : null
  },

  _onSubmit(e) {
    e.preventDefault()
    var form = this.refs.thingForm.getForm()
    form.validate(this.refs.form, (err, isValid) => {
      if (isValid) {
        this.transitionTo('/add-thing', null, {
          method: 'POST',
          body: form.data
        })
      }
    })
  },

  render() {
    var {location} = this.props
    var data = location.state && location.state.data
    return <div className="AddThing">
      <h2>Add Thing</h2>
      <form action="/add-thing" method="POST" onSubmit={this._onSubmit} ref="form" autoComplete="off" noValidate={this.state.client}>
        <RenderForm form={ThingForm} ref="thingForm"
          data={data}
          errors={this._getErrorObject()}
          progress={Validating}
        />
        <button>Submit</button> or <Link to="/things">Cancel</Link>
      </form>
    </div>
  }
})

module.exports = AddThing
