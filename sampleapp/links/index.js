import APIExplorer from './../../src'
import AddLinksPlugin from './plugin'
import OperationPropsTab from './OperationPropsTab'

APIExplorer
  .config(c => {
    c.swagger2API('petstore', 'http://localhost:3000/sampleapp/petstore/petstore.json', true)
  })
  .configWidgetTabs(c => {
    c.addWidgetTab('Operation Props', OperationPropsTab)
  })
  .configPlugins(c => {
    c.addPlugin(AddLinksPlugin)
  })
  .start()
