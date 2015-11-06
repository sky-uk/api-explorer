var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')

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

var cors_proxy = require('cors-anywhere')

cors_proxy.createServer({
  originWhitelist: [], // Allow all origins
  removeHeaders: ['cookie', 'cookie2']
}).listen(9000, '127.0.0.1', function () {
  console.log('Running CORS Anywhere on localhost:9000')
})
