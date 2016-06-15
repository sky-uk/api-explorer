import APIExplorer from './../../src'
import AddLinksPlugin from './plugin'
import OperationPropsTab from './OperationPropsTab'

APIExplorer
  .addAPI('petstore', 'swagger2', 'http://localhost:3000/sampleapp/petstore/petstore.json', c => {
    c.useProxy(true)
  })
  .addWidgetTab('Operation Props', OperationPropsTab)
  .addPlugin(AddLinksPlugin)
  .configCORS({ credentials: 'omit' })
  .start()
