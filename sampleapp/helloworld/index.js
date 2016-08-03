import APIExplorer from './../../src'

APIExplorer
  .addAPI('helloworld', 'swagger2', `${window.location.protocol}//${window.location.host}/sampleapp/helloworld/helloworld.json`, c => {
    c.useProxy(true)
  })
  .start()
