var Express = require('express')
var path = require('path')
var port = process.env.PORT || 3000
var app = new Express()

var server = require('./server-common')
server(app, port, path.join(__dirname, '..', 'dist'))
