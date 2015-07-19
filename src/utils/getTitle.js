'use strict';

var assign = require('react/lib/Object.assign')

function getTitle(components, params, props, options) {
  options = assign({reverse: true, join: ' · ', defaultTitle: '(untitled)'}, options)
  var titleParts = []
  components.forEach(component => {
    if (component.title) {
      titleParts.push(component.title)
    }
    else if (component.getTitle) {
      titleParts.push(component.getTitle(props, params))
    }
  })

  if (options.reverse) {
    titleParts.reverse()
  }
  return titleParts.join(options.join) || options.defaultTitle
}

module.exports = getTitle
