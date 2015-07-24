'use strict';

var assign = require('react/lib/Object.assign')

var getPropsForComponent = require('./getPropsForComponent')

function getTitle(routerState, componentsArray, propsArray, options) {
  var {components, params} = routerState
  options = assign({reverse: true, join: ' · ', defaultTitle: '(untitled)'}, options)
  var titleParts = []
  components.forEach(component => {
    if (component.title) {
      titleParts.push(component.title)
    }
    else if (component.getTitle) {
      var props = component.loadProps
                  ? getPropsForComponent(component, componentsArray, propsArray)
                  : {}
      titleParts.push(component.getTitle(props, params))
    }
  })

  if (options.reverse) {
    titleParts.reverse()
  }
  return titleParts.join(options.join) || options.defaultTitle
}

module.exports = getTitle
