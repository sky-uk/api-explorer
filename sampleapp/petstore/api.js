module.exports = function (app, port, basePath) {
  app.get('/sampleapp/petstore/petstore.json', function (req, res) {
    res.sendFile(basePath + req.path)
  })
}
