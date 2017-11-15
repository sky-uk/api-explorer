import APIExplorer from './../../src'
import AddLinksPlugin from './plugin'
import OperationPropsTab from './OperationPropsTab'
import CurlGeneratorTab from './CurlGeneratorTab'

APIExplorer
  .addAPI('petstore', 'swagger2', `${window.location.protocol}//${window.location.host}/sampleapp/links/petstore.json`, c => {
    c.useProxy(true)
  })
  .addWidgetTab('Operation Props', OperationPropsTab)
  .addWidgetTab('CURL', CurlGeneratorTab)
  .addPlugin(AddLinksPlugin)
  .addHeader('x-api-key', 'somekey')
  .configCORS({ credentials: 'omit' })
  .start()
