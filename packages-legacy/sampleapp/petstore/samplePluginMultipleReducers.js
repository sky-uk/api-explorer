import { combineReducers } from 'redux'

const pluginSpec = {
  key: 'spMultipleReducers',
  name: 'Sample Plugin',
  reducer: combineReducers({
    counter: counterReducer,
    other: otherReducer
  })
}

function counterReducer (state = 1, action) {
  switch (action.type) {
    case 'NEW_OPERATION':
      return state + 1
  }
  return state
}

function otherReducer (state = 'INITIAL STATE', action) {
  return state
}

export default pluginSpec
