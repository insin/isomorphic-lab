'use strict';

var forms = require('newforms')

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

  cleanDescription() {
    if (this.cleanedData.description.split(/\r\n|[\r\n]/).length > 5) {
      throw forms.ValidationError('No more than 5 lines, please.')
    }
  }
})

module.exports = {
  ThingForm
}