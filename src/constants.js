'use strict';

var env = require('./utils/env')

var PORT = process.env.PORT
var BASE_URL = env.SERVER ? `http://localhost:${PORT}` : ''

module.exports = {
  API_URL: `${BASE_URL}/api`
, TITLE: 'Isomorphic Lab'
}