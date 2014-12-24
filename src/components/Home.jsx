'use strict';

var React = require('react')

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
    </div>
  }
})

module.exports = Home