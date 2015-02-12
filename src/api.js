'use strict';

var express = require('express')
var {ValidationError} = require('newforms')

var {ThingForm} = require('./forms')

var THINGS = [
  {name: 'First thing', price: 42.42, description: 'The very first thing.'}
]

function isNameTaken(name) {
  name = name.toLowerCase()
  for (var i = 0, l = THINGS.length; i < l ; i++) {
    if (THINGS[i].name.toLowerCase() == name) {
      return true
    }
  }
  return false
}

var router = express.Router()

router.get('/things', (req, res, next) => {
  res.json(THINGS)
})

router.post('/things', (req, res, next) => {
  var form = new ThingForm({data: req.body})
  // Extra validation to test display of server-only validation errors when JS
  // runs on the client.
  form.clean = function() {
    var {name, description} = this.cleanedData
    if (/clown/i.test(name + description)) {
      throw new ValidationError('No clowns, please.')
    }
  }
  form.validate((err, isValid) => {
    if (err) { return next(err) }
    if (!isValid) { return res.status(400).json(form.errors()) }
    var thing = form.cleanedData
    thing.price = Number(thing.price)
    THINGS.unshift(thing)
    THINGS.splice(10, THINGS.length)
    res.sendStatus(200)
  })
})

router.get('/things/checkname', (req, res, next) => {
  if (!req.query.name) {
    return res.status(400).json({error: 'No name specified.'})
  }
  res.json({taken: isNameTaken(req.query.name)})
})

router.get('/things/:num', (req, res, next) => {
  var {num} = req.params
  if (!/^(?:[1-9]|10)$/.test(num)) {
    return res.status(404).json({error: 'Invalid thing number.'})
  }
  var index = Number(num) - 1
  if (!THINGS[index]) {
    return res.status(404).json({error: `Thing number ${num} not found.`})
  }
  res.json(THINGS[index])
})

module.exports = router