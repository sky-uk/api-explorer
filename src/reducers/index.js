import { combineReducers } from 'redux'
import todos from './todos'
import settings from './settings'
import { routerStateReducer } from 'redux-router'

const rootReducer = combineReducers({
  todos: todos,
  settings: settings,
  router: routerStateReducer
})

export default rootReducer
