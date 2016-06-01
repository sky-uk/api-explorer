module.exports = function (expressApp, port, basePath) {
  expressApp.get('/sampleapp/helloworld/helloworld.json', function (req, res) {
    res.sendFile(basePath + req.path)
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
}
