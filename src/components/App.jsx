'use strict';

var React = require('react')
var {Link, RouteHandler} = require('react-router')

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
      <h1><Link to="home"><img src="/img/logo.png"/> Isomorphic Lab</Link> <small>({this.state.server ? 'server' : 'client'} version)</small></h1>
      <hr/>
      <nav>
        <Link to="things">Things</Link>{' | '}
        <Link to="forums">Forums</Link>
      </nav>
      <hr/>
      <RouteHandler {...this.props}/>
      <footer>
        <a href="https://github.com/insin/isomorphic-lab">
          <img
            style={{position: 'absolute', top: 0, right: 0, border: 0}}
            src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" alt="Fork me on GitHub"
          />
        </a>
      </footer>
    </div>
  }
})

module.exports = App