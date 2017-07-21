import APIExplorer from './../../src'
import AddLinksPlugin from './plugin'
import AddUrlLinksPlugin from './urlPlugin'
import OperationPropsTab from './OperationPropsTab'

APIExplorer
  .addAPI('petstore', 'swagger2', `${window.location.protocol}//${window.location.host}/sampleapp/links/petstore.json`, c => {
    c.useProxy(true)
  })
  .addWidgetTab('Operation Props', OperationPropsTab)
  .addPlugin(AddUrlLinksPlugin)
  .addPlugin(AddLinksPlugin)
  .addHeader('x-api-key', 'somekey')
  .configCORS({ credentials: 'omit' })
  .start()
