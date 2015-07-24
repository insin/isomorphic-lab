'use strict';

function getPropsForComponent(Component, componentsArray, propsArray) {
  var index = componentsArray.indexOf(Component)
  return propsArray[index]
}

module.exports = getPropsForComponent
