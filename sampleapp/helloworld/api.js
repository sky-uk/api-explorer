module.exports = function (expressApp, port, basePath) {
  expressApp.get('/sampleapp/helloworld/helloworld.json', function (req, res) {
    res.sendFile(basePath + req.path)
  })

  expressApp.get('/sampleapp/helloworld/hello', function (req, res) {
    res.json({response: 'Hello World'})
  })
}
