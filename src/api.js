'use strict';

var express = require('express')
var {ValidationError} = require('newforms')

var {ThingForm} = require('./forms')

var THINGS = [
  {name: 'First thing', price: '42.42', description: 'The very first thing'}
]

var router = express.Router()

router.get('/things', (req, res, next) => {
  res.json(THINGS)
})

router.post('/addthing', (req, res, next) => {
  var form = new ThingForm({data: req.body})
  // Extra validation to test display of server-only validation errors
  form.cleanName = function() {
    if (this.cleanedData.name == 'First thing') {
      throw new ValidationError('This is a reserved name - please choose another.')
    }
  }
  if (form.isValid()) {
    THINGS.push(form.cleanedData)
    res.sendStatus(200)
  }
  else {
    res.status(400).json(form.errors())
  }
})

module.exports = router