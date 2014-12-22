'use strict';

var React = require('react')
var ReactDocumentTitle = require('react-document-title')

var {TITLE} = require('../constants')

var DocumentTitle = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.title != nextProps.title
  },
  render() {
    var title = (this.props.title ? `${this.props.title} · ${TITLE}` : TITLE)
    return <ReactDocumentTitle title={title}/>
  }
})

module.exports = DocumentTitle