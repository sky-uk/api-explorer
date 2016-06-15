import APIExplorer from './../src'

APIExplorer
  .addAPI('hAPI', 'swagger2', 'http://localhost:3000/samples/hapi.json', c => {
    c.addInterceptor(swagger2_replaceDefaultParamByXDefaultValue)
    c.useProxy(false)
    c.addHeader('Test', 'test')
  })
  .enableQueryStringConfig('url')
  .configCORS({ credentials: 'include' })
  .start()

function swagger2_replaceDefaultParamByXDefaultValue (config, apiSpec) {
  Object.keys(apiSpec.paths).forEach(path_key => {
    var path = apiSpec.paths[path_key]
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
