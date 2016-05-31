import APIExplorer from './../../src'
import OperationPropsTab from './OperationPropsTab'

APIExplorer
  .config(c => {
    c.swagger2API('petstore', 'http://localhost:3000/samples/petstore.json', true)
  })
  .configPlugins(c => {

    c.addPlugin({
      key: 'samplePlugin',
      name: 'Sample Plugin',
      reducer: pluginReducer
    })

    c.addPlugin({
      key: 'samplePlugin2',
      name: 'Sample Plugin'
    })

  })
  .configWidgetTabs(c => {
    c.addWidgetTab('Operation Props', OperationPropsTab)
  })
  .configHeaders(c => {
    c.addHeader('X-Foo', 'Some Values')
    c.addHeader('X-Bar', 'Another Value')
  })
  .start()

function pluginReducer (state = 1, action) {
  switch (action.type) {
    case 'NEW_OPERATION':
      return state + 1
  }
  return state
}
