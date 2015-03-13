'use strict';

var assign = require('react/lib/Object.assign')
var {ErrorObject, RenderForm} = require('newforms')
var React = require('react')
var {Link, Navigation} = require('react-router')
var superagent = require('superagent')

var {FORUM_API_URL} = require('../constants')
var {TopicForm} = require('../forms')
var env = require('../utils/env')
var events = require('../utils/events')
var Render = require('../utils/Render')

var AddTopic = React.createClass({
  mixins: [Navigation],

  statics: {
    ERRORS_EVENT: 'AddTopic:errors',

    getTitle(props) {
      return `Posting a New Topic in ${props.data.addTopic.name}`
    },

    fetchData(params, cb) {
      superagent.get(`${FORUM_API_URL}/forum/${params.id}/add-topic`).end((err, res) => {
        cb(err, res && {addTopic: res.body})
      })
    },

    willTransitionTo(transition, params, query, cb) {
      if (query._method != 'POST') { return cb() }
      delete query._method

      superagent.post(`${FORUM_API_URL}/forum/${params.id}/add-topic`).send(query).end((err, res) => {
        if (err && (!err.response || err.response.serverError)) { return cb(err) }

        if (res.clientError) {
          if (env.CLIENT) {
            // Update the form with validation errors received from the API
            events.emit(AddTopic.ERRORS_EVENT, ErrorObject.fromJSON(res.body))
            transition.abort()
          }
          else {
            // Re-render with user input + validation errors from the API
            transition.abort(new Render(`/forums/forum/${params.id}/add-topic`, {
              initialData: query
            , initialErrors: res.body
            }))
          }
        }
        else if (res.ok) {
          transition.redirect(`/forums/topic/${res.body.topic.id}`)
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

  componentWillMount() {
    if (this.props.initialErrors) {
      this.initialErrors = ErrorObject.fromJSON(this.props.initialErrors)
    }
  },

  componentDidMount() {
    events.on(AddTopic.ERRORS_EVENT, this._onErrors)
    this.setState({client: true})
  },

  componentWillUnmount() {
    events.removeListener(AddTopic.ERRORS_EVENT, this._onErrors)
  },

  _onSubmit(e) {
    e.preventDefault()
    var form = this.refs.topicForm.getForm()
    if (form.validate(this.refs.form)) {
      this.transitionTo(
        this.makeHref('addTopic', {id: this.props.data.addTopic.id}),
        {},
        assign({_method: 'POST'}, form.data)
      )
    }
  },

  _onErrors(errors) {
    this.refs.topicForm.getForm().setErrors(errors)
  },

  render() {
    var {id, name, section} = this.props.data.addTopic
    return <div className="AddTopic">
      <div className="Breadcrumbs">
        <Link to="forums">Forums</Link>
        {' → '}
        <Link to="section" params={{id: section.id}}>{section.name}</Link>
        {' → '}
        <Link to="forum" params={{id}}>{name}</Link>
      </div>
      <h2>Posting a New Topic in {name}</h2>
      <form action={this.makeHref('addTopic', {id})} method="POST" onSubmit={this._onSubmit} ref="form" autoComplete="off" noValidate={this.state.client}>
        <RenderForm form={TopicForm} ref="topicForm"
          data={this.props.initialData}
          errors={this.initialErrors}
        />
        <button>Submit</button> or <Link to="forum" params={{id}}>Cancel</Link>
      </form>
    </div>
  }
})

module.exports = AddTopic