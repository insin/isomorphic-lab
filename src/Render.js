'use strict';

/**
 * Render the app with a URL, passing the handler the given props in addition to
 * any data fetched for it.
 */
function Render(url, props) {
  this.url = url
  this.props = props
}

module.exports = Render