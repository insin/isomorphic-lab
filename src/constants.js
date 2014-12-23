'use strict';

var HOST = process.env.HOST
var PORT = process.env.PORT
var BASE_URL = `http://${HOST}:${PORT}`

module.exports = {
  API_URL: `${BASE_URL}/api`
, BASE_URL
, HOST
, PORT
, TITLE: 'Isomorphic Lab'
}