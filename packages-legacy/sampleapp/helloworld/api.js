module.exports = function (expressApp, port, basePath) {
  expressApp.get('/sampleapp/helloworld/helloworld.json', function (req, res) {
    res.sendFile(basePath + req.path)
  })

  expressApp.all('/sampleapp/helloworld/verbs', function (req, res) {
    res.json({response: 'Hi'})
  })

  expressApp.get('/sampleapp/helloworld/hello', function (req, res) {
    res.json({response: 'Hello World'})
  })

  expressApp.all('/sampleapp/helloworld/hello/*', function (req, res) {
    res.json({response: req.path})
  })

  expressApp.all('/sampleapp/helloworld/oldhello*', function (req, res) {
    res.json({response: 'Deprecated operation'})
  })

  expressApp.get('/sampleapp/helloworld/echo-status', function (req, res) {
    res.status(req.query.status).json({response: 'status: ' + req.query.status})
  })
}
