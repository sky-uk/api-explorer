var request = require('request')
var Express = require('express')
var path = require('path')

module.exports = function (app, port, rootPath) {
  app.use(Express.static(path.join(rootPath, '/public')))

  app.all('/proxy/*', function (req, res) {
    try {
      var url = decodeURIComponent(req.query.url)
      req.pipe(request(url)).pipe(res)
    } catch (err) {
      res.status(500).send(err)
    }
  })

  // TODO: CG: I guess this is not required anymore
  app.get('/samples/*', function (req, res) {
    res.sendFile(rootPath + req.path)
  })

  // TODO: CG: I guess this is not required anymore
  app.get('/*.js', function (req, res) {
    res.sendFile(rootPath + req.path)
  })

  // SPA fallback. Serve everything as index.html
  app.get('(/explorer)?/*', function (req, res) {
    res.sendFile(path.join(rootPath, 'server', '/index.html'))
  })

  app.listen(port, function (error) {
    if (error) {
      console.error(error)
    } else {
      console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
    }
  })
}
