import APIExplorer from './../../src'

APIExplorer
  .addAPI('helloworld', 'swagger2', `/sampleapp/helloworld/helloworld.json`)
  .start()
