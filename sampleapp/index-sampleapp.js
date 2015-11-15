import APIExplorer from './../src'

APIExplorer
  .config(c => {
    // If a specification exists in the query string
    const queryString = parseQueryString(document.location)
    console.log(queryString)
    if (queryString.hasOwnProperty('swaggerSpec')) {
      const specLoader = queryString.swaggerLoader || 'swagger2API'
      const swaggerUseProxy = queryString.swaggerUseProxy === 'on'
      c[specLoader]('url', queryString.swaggerSpec, swaggerUseProxy)
    } else {
      // Otherwise use the pre-configured settings
      // c.swagger2API('petshop', 'https://api.swaggerhub.com/apis/anil614sagar/petStore/1.0.0', true)
      // http://localhost:3000/?swaggername=Web%20Api&swaggerpath=&swaggerconfig=swagger1API
      // c.swagger2API('Instagram', '/samples/instagram.json')
      // c.swagger2API('petshopx', 'https://raw.githubusercontent.com/swagger-api/swagger-spec/master/examples/v2.0/json/petstore-with-external-docs.json')
      // c.swagger2API('petshop', 'https://api.swaggerhub.com/apis/anil614sagar/petStore/1.0.0', true)
      // c.swagger2API('petshop', 'https://petstore.swagger.io/v2/swagger.json')
      // c.swagger2API('Pet Store', '/samples/petstore.json')
      // c.swagger2API('Twitter', '/samples/twitter.json')
    }
  })
  .configWidgetTabs(c => {
    // c.addWidgetTab('HATEOAS', SSPAPIExplorer.HATEOASWidget)
  })
  .configHeaders(c => {
    c.addHeader('Test', 'test')
  })
  .start()

// Utility ------------------------------------------------------------------------------------------------------------
function parseQueryString (location) {
  const qs = { }
  location.search.substr(1)
        .split('&')
        .map(_ => _.split('='))
        .forEach(a => qs[decodeURIComponent(a[0]).replace('[]', '')] = decodeURIComponent(a[1]))
  return qs
}
