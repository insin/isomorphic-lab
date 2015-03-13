'use strict';

var forms = require('newforms')
var superagent = require('superagent')

var {API_URL} = require('./constants')

var ThingForm = forms.Form.extend({
  name: forms.CharField({maxLength: 25
  , helpText: 'Up to 25 characters; must be unique.'
  }),
  price: forms.DecimalField({minValue: 0, maxValue: 100, decimalPlaces: 2
  , helpText: 'No greater than 100, please.'
  }),
  description: forms.CharField({maxLength: 140
  , widget: forms.Textarea({attrs: {rows: 5, cols: 60}})
  , helpText: 'Up to 140 characters; no more than 5 lines.'
  }),

  cleanName(cb) {
    var {name} = this.cleanedData
    superagent.get(`${API_URL}/things/checkname`).query({name}).accept('json').end((err, res) => {
      if (err) { return cb(err) }
      if (res.body.taken) {
        return cb(null, 'This name is already taken - please choose another.')
      }
      cb(null)
    })
  },

  cleanDescription() {
    if (this.cleanedData.description.split(/\r\n|[\r\n]/).length > 5) {
      throw forms.ValidationError('No more than 5 lines, please.')
    }
  }
})

var TopicForm = forms.Form.extend({
  title: forms.CharField(),
  body: forms.CharField({widget: forms.Textarea})
})

var ReplyForm = forms.Form.extend({
  body: forms.CharField({widget: forms.Textarea})
})

module.exports = {
  ThingForm
, TopicForm
, ReplyForm
}