var request = require('request')
var Express = require('express')

module.exports = function (app, port, basePath) {
  app.use(Express.static(__dirname + '/public'))

  app.all('/proxy/*', function (req, res) {
    var url = decodeURIComponent(req.query.url)
    req.pipe(request(url)).pipe(res)
  })

  app.get('/samples/*', function (req, res) {
    res.sendFile(basePath + req.path)
  })

  app.get('/*.js', function (req, res) {
    res.sendFile(basePath + req.path)
  })

  app.get('/*', function (req, res) {
    res.sendFile(basePath + '/index.html')
  })

  app.listen(port, function (error) {
    if (error) {
      console.error(error)
    } else {
      console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
    }
  })
}
