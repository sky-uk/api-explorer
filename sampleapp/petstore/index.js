import APIExplorer from './../../src'
import OperationPropsTab from './OperationPropsTab'

APIExplorer
  .config(c => {
    c.swagger2API('petstore', 'http://localhost:3000/samples/petstore.json', true)
  })
  .configWidgetTabs(c => {
    c.addWidgetTab('Operation Props', OperationPropsTab)
  })
  .configHeaders(c => {
    c.addHeader('X-Foo', 'Some Values')
    c.addHeader('X-Bar', 'Another Value')
  })
  .start()
