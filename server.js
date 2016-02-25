var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')

var Express = require('express')
var morgan = require('morgan')
var app = new Express()
app.use(morgan('combined'))
var port = process.env.PORT || 3000

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

var server = require('./server-common')
server(app, port, __dirname)
