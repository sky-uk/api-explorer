import APIExplorer from './../src'

APIExplorer
  .enableQueryStringConfig('url')
  .config(c => {
    // c.swagger2API('hAPI', 'http://localhost:3000/samples/hapi.json')
    // c.swagger2API('Thoth', 'http://adeetc.thothapp.com/swagger/docs/v2', true)
  })
  .configWidgetTabs(c => {
    // c.addWidgetTab('HATEOAS', SSPAPIExplorer.HATEOASWidget)
  })
  .configHeaders(c => {
    c.addHeader('Test', 'test')
  })
  .configInterceptors(c => {
    c.swagger1Interceptor(swagger1_replaceDefaultValueByXDefaultValue)
    c.swagger2Interceptor(swagger2_replaceDefaultParamByXDefaultValue)
    // c.swagger2Interceptor(thothInterceptor)
  })
  .start()

/* function thothInterceptor (config, apiSpec) {
  apiSpec.basePath = '/'
  apiSpec.schemes = ['https']
  apiSpec.host = 'adeetc.thothapp.com'
  return apiSpec
}*/

function swagger1_replaceDefaultValueByXDefaultValue (config, apiSpec) {
  apiSpec.apis.forEach(api => {
    api.operations.forEach(operation => {
      operation.parameters.forEach(parameter => {
        if (parameter.defaultValue) {
          const value = parameter.defaultValue
          delete parameter.defaultValue
          parameter['x-defaultValue'] = value
        }
      })
    })
  })
  return apiSpec
}

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
