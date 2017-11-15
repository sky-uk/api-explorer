import APIExplorer from './../src'

APIExplorer
  .addAPI('hAPI', 'swagger2', 'http://localhost:3000/samples/hapi.json', c => {
    c.addInterceptor(swagger2ReplaceDefaultParamByXDefaultValue)
    c.useProxy(false)
    c.addHeader('Test', 'test')
  })
  .configCORS({ credentials: 'include' })
  .start()

function swagger2ReplaceDefaultParamByXDefaultValue (config, apiSpec) {
  Object.keys(apiSpec.paths).forEach(pathKey => {
    var path = apiSpec.paths[pathKey]
    Object.keys(path).forEach(httpMethod => {
      var operation = path[httpMethod]
      var parameters = operation.parameters || []
      parameters.forEach(param => {
        if (param.hasOwnProperty('default')) {
          param['x-defaultValue'] = param.default
        }
      })
    })
  })

  return apiSpec
}
