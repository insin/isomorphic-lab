'use strict';

var {ErrorObject, RenderForm} = require('newforms')
var React = require('react')
var {Link, Navigation} = require('react-router')
var superagent = require('superagent-ls')

var {FORUM_API_URL} = require('../constants')
var {TopicForm} = require('../forms')

var AddTopic = React.createClass({
  mixins: [Navigation],

  propTypes: {
    data: React.PropTypes.object,
    errors: React.PropTypes.object
  },

  statics: {
    getTitle(props) {
      return `Posting a New Topic in ${props.addTopic.name}`
    },

    loadProps(params, cb) {
      superagent.get(`${FORUM_API_URL}/forum/${params.id}/add-topic`).end((err, res) => {
        cb(err, res && {addTopic: res.body})
      })
    },

    onEnter(routerState, transition, cb) {
      var req = routerState.location.state
      if (!req || req.method !== 'POST') { return cb() }

      var {params} = routerState
      superagent.post(`${FORUM_API_URL}/forum/${params.id}/add-topic`).send(req.body).end((err, res) => {
        if (err || res.serverError) {
          return cb(err || new Error(`Server error: ${res.body}`))
        }

        if (res.clientError) {
          transition.to(`/forums/forum/${params.id}/add-topic`, null, {
            data: req.body,
            errors: res.body
          })
        }
        else {
          transition.to(`/forums/topic/${res.body.topic.id}`)
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
      this.refs.topicForm.getForm().setErrors(errorObject)
    }
  },

  _getErrorObject(props) {
    var state = (props ? props.location : this.props.location).state
    return state && state.errors ? ErrorObject.fromJSON(state.errors) : null
  },

  _onSubmit(e) {
    e.preventDefault()
    var form = this.refs.topicForm.getForm()
    if (form.validate(this.refs.form)) {
      var {id} = this.props.addTopic
      this.transitionTo(`/forums/forum/${id}/add-topic`, null, {
        method: 'POST',
        body: form.data
      })
    }
  },

  render() {
    var {addTopic, location} = this.props
    var {id, name, section} = addTopic
    var data = location.state && location.state.data
    return <div className="AddTopic">
      <div className="Breadcrumbs">
        <Link to="/forums">Forums</Link>
        {' → '}
        <Link to={`/forums/section/${section.id}`}>{section.name}</Link>
        {' → '}
        <Link to={`/forums/forum/${id}`}>{name}</Link>
      </div>
      <h2>Posting a New Topic in {name}</h2>
      <form action={`/forums/forum/${id}/add-topic`} method="POST" onSubmit={this._onSubmit} ref="form" autoComplete="off" noValidate={this.state.client}>
        <RenderForm form={TopicForm} ref="topicForm"
          data={data}
          errors={this._getErrorObject()}
        />
        <button>Submit</button> or <Link to={`/forums/forum/${id}`}>Cancel</Link>
      </form>
    </div>
  }
})

module.exports = AddTopic
