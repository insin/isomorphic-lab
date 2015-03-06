'use strict';

var {ErrorObject, RenderForm} = require('newforms')
var React = require('react')
var {Link, Navigation} = require('react-router')
var superagent = require('superagent')

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
      return `Posting a New Topic in ${props.data.addTopic.name}`
    },

    fetchData(params, cb) {
      superagent.get(`${FORUM_API_URL}/forum/${params.id}/addTopic`).end(function(err, res) {
        cb(err, res && {addTopic: res.body})
      })
    },

    willTransitionTo(transition, params, query, payload, cb) {
      if (payload.method != 'POST') { return cb() }

      superagent.post(`${FORUM_API_URL}/forum/${params.id}/addTopic`).send(payload.body).end(res => {
        if (res.serverError) {
          return cb(new Error(`Server error: ${res.body}`))
        }

        if (res.clientError) {
          transition.redirect('addTopic', params, {}, {
            data_: payload.body,
            errors: res.body
          })
        }
        else {
          transition.redirect('topic', {id: res.body.topic.id})
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
    var form = this.refs.topicForm.getForm()
    if (form.validate(this.refs.form)) {
      this.transitionTo('addTopic', {id: this.props.data.addTopic.id}, {}, {
        method: 'POST',
        body: form.data
      })
    }
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
          data={this.props.data_}
          errors={this._getErrorObject()}
        />
        <button>Submit</button> or <Link to="forum" params={{id}}>Cancel</Link>
      </form>
    </div>
  }
})

module.exports = AddTopic