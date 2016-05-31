const pluginSpec = {
  key: 'samplePlugin',
  name: 'Sample Plugin',
  reducer: counterReducer
}

// Sample (and dummy) reducer that only count the number of operations
function counterReducer (state = 1, action) {
  switch (action.type) {
    case 'NEW_OPERATION':
      return state + 1
  }
  return state
}

export default pluginSpec
