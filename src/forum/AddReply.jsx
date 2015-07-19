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
      return `Replying To ${props.data.addReply.title}`
    },

    fetchData(params, cb) {
      superagent.get(`${FORUM_API_URL}/topic/${params.id}/add-reply`).end((err, res) => {
        cb(err, res && {addReply: res.body})
      })
    },

    onEnter(state, transition, cb) {
      var req = state.location.state
      if (!req || req.method !== 'POST') { return cb() }

      var {params} = state
      superagent.post(`${FORUM_API_URL}/topic/${params.id}/add-reply`).send(req.body).end((err, res) => {
        if (err || res.serverError) {
          return cb(err || new Error(`Server error: ${res.body}`))
        }

        if (res.clientError) {
          transition.to(`/forums/topic/${params.id}/add-reply`, null, {
            data_: req.body,
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
    if (nextProps.errors) {
      var errorObject = this._getErrorObject(nextProps.errors)
      this.refs.topicForm.getForm().setErrors(errorObject)
    }
  },

  _getErrorObject(errors) {
    if (!errors) { errors = this.props.errors }
    return errors ? ErrorObject.fromJSON(errors) : null
  },

  _onSubmit(e) {
    e.preventDefault()
    var form = this.refs.replyForm.getForm()
    if (form.validate(this.refs.form)) {
      var {id} = this.props.data.addReply
      this.transitionTo(`/forums/topic/${id}/add-reply`, null, {
        method: 'POST',
        body: form.data
      })
    }
  },

  render() {
    var {id, title, section, forum} = this.props.data.addReply
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
          data={this.props.data_}
          errors={this._getErrorObject()}
        />
        <button>Submit</button> or <Link to={`/forums/topic/${id}`}>Cancel</Link>
      </form>
    </div>
  }
})

module.exports = AddReply
