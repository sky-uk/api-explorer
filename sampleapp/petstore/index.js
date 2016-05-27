import APIExplorer from './../../src'
import DummyWidgetTab from './DummyWidgetTab'

APIExplorer
  .config(c => {
    c.swagger2API('petstore', 'http://localhost:3000/samples/petstore.json', true)
  })
  .configWidgetTabs(c => {
    c.addWidgetTab('DummyWidgetTab', DummyWidgetTab)
  })
  .configHeaders(c => {
    c.addHeader('Test', 'test')
  })
  .start()
