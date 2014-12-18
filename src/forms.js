'use strict';

var forms = require('newforms')

var ThingForm = forms.Form.extend({
  name: forms.CharField(),
  price: forms.DecimalField({minValue: 0, decimalPlaces: 2}),
  description: forms.CharField({widget: forms.Textarea})
})

module.exports = {ThingForm}