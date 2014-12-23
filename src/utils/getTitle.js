'use strict';

var assign = require('react/lib/Object.assign')

function getTitle(routes, params, props, options) {
  options = assign({reverse: true, join: ' · ', defaultTitle: '(untitled)'}, options)
  var titleParts = []
  routes.forEach(route => {
    var handler = route.handler
    if (handler.title) {
      titleParts.push(handler.title)
    }
    else if (handler.getTitle) {
      titleParts.push(handler.getTitle(props, params))
    }
  })

  if (options.reverse) {
    titleParts.reverse()
  }
  return titleParts.join(options.join) || options.defaultTitle
}

module.exports = getTitle