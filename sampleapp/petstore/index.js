import APIExplorer from './../../src'
import OperationPropsTab from './OperationPropsTab'
import samplePlugin from './samplePlugin'
import samplePluginMultipleReducers from './samplePluginMultipleReducers'

APIExplorer
  .config(c => {
    c.swagger2API('petstore', 'http://localhost:3000/sampleapp/petstore/petstore.json', true)
  })
  .configPlugins(c => {
    c.addPlugin(samplePlugin)
    c.addPlugin(samplePluginMultipleReducers)
  })
  .configWidgetTabs(c => {
    c.addWidgetTab('Operation Props', OperationPropsTab)
  })
  .configHeaders(c => {
    c.addHeader('X-Foo', 'Some Values')
    c.addHeader('X-Bar', 'Another Value')
  })
  .start()
