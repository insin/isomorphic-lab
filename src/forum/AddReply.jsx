'use strict';

var assign = require('react/lib/Object.assign')
var {ErrorObject, RenderForm} = require('newforms')
var React = require('react')
var {Link, Navigation} = require('react-router')
var promiseAgent = require('superagent-promise')
var superagent = require('superagent')

var {FORUM_API_URL} = require('../constants')
var {ReplyForm} = require('../forms')
var env = require('../utils/env')
var events = require('../utils/events')
var Render = require('../utils/Render')

var AddReply = React.createClass({
  mixins: [Navigation],

  statics: {
    ERRORS_EVENT: 'AddReply:errors',

    getTitle(props) {
      return `Replying To ${props.data.addReply.title}`
    },

    fetchData(params, cb) {
      superagent.get(`${FORUM_API_URL}/topic/${params.id}/addReply`).end(function(err, res) {
        cb(err, res && res.body)
      })
    },

    willTransitionTo(transition, params, query) {
      if (query._method != 'POST') { return }
      delete query._method

      transition.wait(promiseAgent.post(`${FORUM_API_URL}/topic/${params.id}/addReply`).send(query).end().then(res => {
        if (res.serverError) {
          throw new Error(`Server error: ${res.body}`)
        }

        if (res.clientError) {
          if (env.CLIENT) {
            // Update the form with validation errors received from the API
            events.emit(AddReply.ERRORS_EVENT, ErrorObject.fromJSON(res.body))
            transition.abort()
          }
          else {
            // Re-render with user input + validation errors from the API
            transition.abort(new Render(`/forums/topic/${params.id}/add-reply`, {
              initialData: query
            , initialErrors: res.body
            }))
          }
        }
        else if (res.ok) {
          transition.redirect(`/forums/topic/${params.id}`)
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
    events.on(AddReply.ERRORS_EVENT, this._onErrors)
    this.setState({client: true})
  },

  componentWillUnmount() {
    events.removeListener(AddReply.ERRORS_EVENT, this._onErrors)
  },

  _onSubmit(e) {
    e.preventDefault()
    var form = this.refs.replyForm.getForm()
    if (form.validate(this.refs.form)) {
      this.transitionTo(
        this.makeHref('addReply', {id: this.props.data.addReply.id}),
        {},
        assign({_method: 'POST'}, form.data)
      )
    }
  },

  _onErrors(errors) {
    this.refs.replyForm.getForm().setErrors(errors)
  },

  render() {
    var {id, title, section, forum} = this.props.data.addReply
    return <div className="AddReply">
      <div className="Breadcrumbs">
        <Link to="forums">Forums</Link>
        {' → '}
        <Link to="section" params={{id: section.id}}>{section.name}</Link>
        {' → '}
        <Link to="forum" params={{id: forum.id}}>{forum.name}</Link>
        {' → '}
        <Link to="topic" params={{id}}>{title}</Link>
      </div>
      <h2>Replying to {title}</h2>
      <form action={this.makeHref('addReply', {id})} method="POST" onSubmit={this._onSubmit} ref="form" autoComplete="off" noValidate={this.state.client}>
        <RenderForm form={ReplyForm} ref="replyForm"
          data={this.props.initialData}
          errors={this.initialErrors}
        />
        <button>Submit</button> or <Link to="topic" params={{id}}>Cancel</Link>
      </form>
    </div>
  }
})

module.exports = AddReply