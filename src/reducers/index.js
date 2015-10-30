import { combineReducers } from 'redux'
import { routerStateReducer } from 'redux-router'
import loaderReducer from './loader'

const rootReducer = combineReducers({
  loader: loaderReducer,
  router: routerStateReducer
})

export default rootReducer
