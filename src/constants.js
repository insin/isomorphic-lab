'use strict';

var HOST = process.env.HOST
var PORT = process.env.PORT
var BASE_URL = `http://${HOST}:${PORT}`

module.exports = {
  BASE_URL
, HOST
, PORT
, TITLE: 'Isomorphic Lab'
}