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
      <h1><Link to="home">App</Link> <small>({this.state.server ? 'server' : 'client'} version)</small></h1>
      <nav>
        <Link to="things">Things</Link>
      </nav>
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