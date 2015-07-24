'use strict';

var {ErrorObject, RenderForm} = require('newforms')
var React = require('react')
var {Link, Navigation} = require('react-router')
var superagent = require('superagent-ls')

var {FORUM_API_URL} = require('../constants')
var {ReplyForm} = require('../forms')

var AddReply = React.createClass({
  mixins: [Navigation],

  propTypes: {
    data: React.PropTypes.object,
    errors: React.PropTypes.object
  },

  statics: {
    getTitle(props) {
      return `Replying To ${props.addReply.title}`
    },

    loadProps(params, cb) {
      superagent.get(`${FORUM_API_URL}/topic/${params.id}/add-reply`).end((err, res) => {
        cb(err, res && {addReply: res.body})
      })
    },

    onEnter(routerState, transition, cb) {
      var req = routerState.location.state
      if (!req || req.method !== 'POST') { return cb() }

      var {params} = routerState
      superagent.post(`${FORUM_API_URL}/topic/${params.id}/add-reply`).send(req.body).end((err, res) => {
        if (err || res.serverError) {
          return cb(err || new Error(`Server error: ${res.body}`))
        }

        if (res.clientError) {
          transition.to(`/forums/topic/${params.id}/add-reply`, null, {
            data: req.body,
            errors: res.body
          })
        }
        else {
          transition.to(`/forums/topic/${params.id}`)
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
    var form = this.refs.replyForm.getForm()
    if (form.validate(this.refs.form)) {
      var {id} = this.props.addReply
      this.transitionTo(`/forums/topic/${id}/add-reply`, null, {
        method: 'POST',
        body: form.data
      })
    }
  },

  render() {
    var {addReply, location} = this.props
    var {id, title, section, forum} = addReply
    var data = location.state && location.state.data
    return <div className="AddReply">
      <div className="Breadcrumbs">
        <Link to="/forums">Forums</Link>
        {' → '}
        <Link to={`/forums/section/${section.id}`}>{section.name}</Link>
        {' → '}
        <Link to={`/forums/forum/${forum.id}`}>{forum.name}</Link>
        {' → '}
        <Link to={`/forums/topic/${id}`}>{title}</Link>
      </div>
      <h2>Replying to {title}</h2>
      <form action={`/forums/topic/${id}/add-reply`} method="POST" onSubmit={this._onSubmit} ref="form" autoComplete="off" noValidate={this.state.client}>
        <RenderForm form={ReplyForm} ref="replyForm"
          data={data}
          errors={this._getErrorObject()}
        />
        <button>Submit</button> or <Link to={`/forums/topic/${id}`}>Cancel</Link>
      </form>
    </div>
  }
})

module.exports = AddReply
