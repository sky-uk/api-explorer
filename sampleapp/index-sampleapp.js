import APIExplorer from './../src'

APIExplorer
  .enableQueryStringConfig('url')
  .config(c => {
    // Otherwise use the pre-configured settings
    // c.swagger2API('petshop', 'https://api.swaggerhub.com/apis/anil614sagar/petStore/1.0.0', true)
    // http://localhost:3000/?swaggername=Web%20Api&swaggerpath=&swaggerconfig=swagger1API
    // c.swagger2API('Instagram', '/samples/instagram.json')
    // c.swagger2API('petshopx', 'https://raw.githubusercontent.com/swagger-api/swagger-spec/master/examples/v2.0/json/petstore-with-external-docs.json')
    // c.swagger2API('petshop', 'https://api.swaggerhub.com/apis/anil614sagar/petStore/1.0.0', true)
    // c.swagger2API('petshop', 'https://petstore.swagger.io/v2/swagger.json')
    // c.swagger2API('Pet Store', '/samples/petstore.json')
    // c.swagger2API('Twitter', '/samples/twitter.json')
  })
  .configWidgetTabs(c => {
    // c.addWidgetTab('HATEOAS', SSPAPIExplorer.HATEOASWidget)
  })
  .configHeaders(c => {
    c.addHeader('Test', 'test')
  })
  .configInterceptors(c => {
    // c.swagger2Interceptor(interceptor)
    c.swagger1Interceptor(interceptor)
  })
  .start()

function interceptor (config, apiSpec) {
  if (config.friendlyName !== 'url') return // 'url' is the friendlyName of APIs configured via QueryString

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
