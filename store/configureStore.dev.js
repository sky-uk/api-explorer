import { createStore, compose, combineReducers } from 'redux'
import { persistState } from 'redux-devtools'
import reducers from '../reducers'
import DevTools from '../containers/DevTools'
import { routerStateReducer, reduxReactRouter } from 'redux-router'
import createHistory from 'history/lib/createBrowserHistory' // history/lib/createHashHistory


const finalCreateStore = compose(
  reduxReactRouter({ createHistory }),
  DevTools.instrument(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore)

export default function configureStore(initialState) {
  const store = finalCreateStore(reducers, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers')
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
