import APIExplorer from './../../src'
import AddLinksPlugin from './plugin'
import OperationPropsTab from './OperationPropsTab'

APIExplorer
  .addAPI('petstore', 'swagger2', `${window.location.protocol}//${window.location.host}/sampleapp/petstore/petstore.json`, c => {
    c.useProxy(true)
  })
  .addWidgetTab('Operation Props', OperationPropsTab)
  .addPlugin(AddLinksPlugin)
  .configCORS({ credentials: 'omit' })
  .start()
