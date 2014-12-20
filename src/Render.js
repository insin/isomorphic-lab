'use strict';

/**
 * Render the app with a URL, passing the handler the given props in addition to
 * any data fetched for it.
 */
function Render(url, extraProps) {
  this.url = url
  this.extraProps = extraProps
}

module.exports = Render