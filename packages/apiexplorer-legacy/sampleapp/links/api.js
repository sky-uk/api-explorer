module.exports = function (app, port, basePath) {
  app.get('/sampleapp/links/petstore.json', function (req, res) {
    res.sendFile(basePath + req.path)
  })
}
