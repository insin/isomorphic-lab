'use strict';

var React = require('react')
var {Link} = require('@insin/react-router')

var Home = React.createClass({
  render() {
    return <div className="Home">
      <p>
        This app is rendered with the same codebase on the client and server
        using <a href="http://facebook.github.io/react/">React</a> and <a href="https://github.com/rackt/react-router">react-router</a>.
      </p>
      <p>
        Full pages are pre-rendered on the server and &ndash; when it can &ndash;
        the client rehydrates the state of the current page on initial load and
        takes over.
      </p>
      <p>
        If you forgot to pay your JavaScript bill (or you're using a laggy or
        slow connection, or your mobile provider breaks stuff with poor attempts
        at script injection, or&hellip;), this app will keep working using HTTP
        round trips to the server.
      </p>
      <p>
        One of the primary goals of this app is to figure out how to implement
        isomorphic <code>&lt;form&gt;</code> submission and redisplay around the
        field rendering and validation provided by
        the <a href="https://github.com/insin/newforms">newforms</a> form library.
      </p>
      <p>
        Why not try <Link to="addThing">adding a Thing</Link> to see how that's going?
      </p>
    </div>
  }
})

module.exports = Home