'use strict';

var express = require('express')
var {ValidationError} = require('newforms')

var {ThingForm} = require('./forms')

var THINGS = [
  {name: 'First thing', price: 42.42, description: 'The very first thing.'}
]

var router = express.Router()

router.get('/things', (req, res, next) => {
  res.json(THINGS)
})

router.get('/thing/:num', (req, res, next) => {
  var {num} = req.params
  if (!/[1-9]|10/.test(num)) {
    return res.status(404).json({error: 'Invalid thing number.'})
  }
  var index = Number(num) - 1
  if (!THINGS[index]) {
    return res.status(404).json({error: `Thing number ${num} not found.`})
  }
  res.json(THINGS[index])
})

router.post('/addthing', (req, res, next) => {
  var form = new ThingForm({data: req.body})
  // Extra validation to test display of server-only validation errors
  form.cleanName = function() {
    for (var i = 0, l = THINGS.length; i < l ; i++) {
      if (THINGS[i].name == this.cleanedData.name) {
        throw new ValidationError('This name is already taken - please choose another.')
      }
    }
  }
  if (form.isValid()) {
    var thing = form.cleanedData
    thing.price = Number(thing.price)
    THINGS.unshift(thing)
    THINGS.splice(10, THINGS.length)
    res.sendStatus(200)
  }
  else {
    res.status(400).json(form.errors())
  }
})

module.exports = router