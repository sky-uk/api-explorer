import APIExplorer from './../src'

APIExplorer
  .config(c => {
    // c.swagger2API('petshopx', 'https://raw.githubusercontent.com/swagger-api/swagger-spec/master/examples/v2.0/json/petstore-with-external-docs.json')
    // c.swagger2API('petshop', 'https://api.swaggerhub.com/apis/anil614sagar/petStore/1.0.0')
    c.swagger2API('Pet Store', '/samples/petstore.json')
    // c.swagger2API('Twitter', '/samples/twitter.json')
    c.swagger2API('Instagram', '/samples/instagram.json')
    // c.swagger2API('petshopa', 'http://petstore.swagger.io/v2/swagger.json')
  })
  .configWidgetTabs(c => {
    // c.addWidgetTab('HATEOAS', SSPAPIExplorer.HATEOASWidget)
  })
  .start()
