'use strict';

var React = require('react')

var {Link, RouteHandler} = require('react-router')

var App = React.createClass({
  getInitialState() {
    return {
      server: true
    }
  },

  componentDidMount() {
    this.setState({server: false})
  },

  render() {
    return <div className="App" >
      <h1><Link to="home">App</Link> <small>({this.state.server ? 'server' : 'client'} version)</small></h1>
      <nav>
        <Link to="things">Things</Link>
      </nav>
      <RouteHandler {...this.props}/>
    </div>
  }
})

module.exports = App