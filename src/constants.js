'use strict';

var env = require('./utils/env')

var HOST = process.env.HOST
var PORT = process.env.PORT
var BASE_URL = env.SERVER ? `http://${HOST}:${PORT}` : ''

module.exports = {
  API_URL: `${BASE_URL}/api`
, TITLE: 'Isomorphic Lab'
}