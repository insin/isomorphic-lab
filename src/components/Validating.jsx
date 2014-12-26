'use strict';

var React = require('react')

var Validating = React.createClass({
  render() {
    return <span className="Validating">
      <img src="/img/spinner.gif" alt=""/> Validating&hellip;
    </span>
  }
})

module.exports = Validating