'use strict';

var React = require('react')
var {Link} = require('react-router')

var {TITLE} = require('../constants')

var App = React.createClass({
  statics: {
    title: TITLE
  },

  getInitialState() {
    return {
      server: true
    }
  },

  componentDidMount() {
    this.setState({server: false})
  },

  render() {
    return <div className="App">
      <h1><Link to="/"><img src="/img/logo.png"/> Isomorphic Lab</Link> <small>({this.state.server ? 'server' : 'client'} version)</small></h1>
      <hr/>
      <nav>
        <Link to="/things">Things</Link>{' | '}
        <Link to="/forums">Forums</Link>
      </nav>
      <hr/>
      {this.props.children}
      <hr/>
      <footer>
        <a href="https://github.com/insin/isomorphic-lab">Fork me on GitHub</a>
      </footer>
    </div>
  }
})

module.exports = App
