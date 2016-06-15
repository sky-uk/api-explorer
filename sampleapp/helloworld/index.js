import APIExplorer from './../../src'

APIExplorer
  .addAPI('helloworld', 'swagger2', 'http://localhost:3000/sampleapp/helloworld/helloworld.json', c => {
    c.useProxy(true)
  })
  .start()
