var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var https = require('https')
var url = require('url')
var config = require('./webpack.config')
var proxy = require('http-proxy').createProxyServer({})

var Express = require('express')
var app = new Express()
var port = process.env.PORT || 3000


var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.get('/samples/*', function (req, res) {
  res.sendFile(__dirname + req.path)
})

app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.listen(port, function (error) {
  if (error) {
    console.error(error)
  } else {
    console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
  }
})

require('http').createServer(function (req, res) {
  var queryData = url.parse(req.url, true).query
  var hostname = url.parse(queryData.url).hostname

  if (queryData.url) {
    console.log('Using proxy to make a request to ' + queryData.url)
    proxy.web(req, res, {
      target: queryData.url,
      agent: https.globalAgent,
      headers: {
        host: hostname
      }
    })
  } else {
    console.log('No url found in query string... discarting')
  }
}).listen(9000)
