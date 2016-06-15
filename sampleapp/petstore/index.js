import APIExplorer from './../../src'
import OperationPropsTab from './OperationPropsTab'
import samplePlugin from './samplePlugin'
import samplePluginMultipleReducers from './samplePluginMultipleReducers'

APIExplorer
  .addAPI('petstore', 'swagger2', 'http://localhost:3000/sampleapp/petstore/petstore.json', c => {
    c.addHeader('X-Foo', 'Some Values')
    c.addHeader('X-Bar', 'Another Value')
    c.useProxy(true)
  })
  .addWidgetTab('Operation Props', OperationPropsTab)
  .addPlugin(samplePlugin)
  .addPlugin(samplePluginMultipleReducers)
  .configCORS({ credentials: 'omit' })
  .start()
