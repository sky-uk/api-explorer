import { createStore, compose, applyMiddleware } from 'redux'
import reducers from 'reducers'
import { reduxReactRouter } from 'redux-router'
import createHistory from 'history/lib/createBrowserHistory' // history/lib/createHashHistory
import thunk from 'redux-thunk'

const finalCreateStore = compose(
  applyMiddleware(thunk),
  reduxReactRouter({ createHistory })
)(createStore)

export default function configureStore (initialState) {
  const store = finalCreateStore(reducers, initialState)
  return store
}
