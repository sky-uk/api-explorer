var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var https = require('https')
var url = require('url')
var httpProxy = require('http-proxy')
var config = require('./webpack.config')

var Express = require('express')
var app = new Express()
var port = process.env.PORT || 3000

var proxy = httpProxy.createProxyServer({})

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.get('/proxy/*', function (req, res) {
  // req.query
  proxy.web(req, res, {
    target: 'https://api.swaggerhub.com/apis/anil614sagar/petStore/1.0.0',
    agent: https.globalAgent,
    headers: {
      host: 'api.swaggerhub.com'
    }
  })
})

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

  if (queryData.url) {
    console.log('Using proxy to make a request to "' + queryData.url + '"')

    proxy.web(req, res, {
      target: queryData.url,
      agent: https.globalAgent,
      headers: {
        host: 'api.swaggerhub.com'
      }
    })
  } else {
    console.log('No url found in query string... discarting')
  }
}).listen(9000)
