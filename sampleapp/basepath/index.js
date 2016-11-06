import APIExplorer from './../../src'
import AddLinksPlugin from './plugin'

APIExplorer
  .addAPI('petstore', 'swagger2', `/sampleapp/petstore/petstore.json`, c => {
    c.useProxy(true)
  })
  .addPlugin(AddLinksPlugin)
  .configCORS({ credentials: 'omit' })
  .setBasePath('/explorer')
  .start()
