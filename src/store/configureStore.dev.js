import { createStore, compose, applyMiddleware } from 'redux'
import { persistState } from 'redux-devtools'
import reducers from 'reducers'
import injectDevTools from 'components/DevTools'
import { reduxReactRouter } from 'redux-router'
import createHistory from 'history/lib/createBrowserHistory' // history/lib/createHashHistory
import thunk from 'redux-thunk'

let DevTools = injectDevTools()

const finalCreateStore = compose(
  applyMiddleware(thunk),
  reduxReactRouter({ createHistory }),
  DevTools ? DevTools.instrument({ maxAge: 2 }) : null,
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore)

export default function configureStore (initialState) {
  const store = finalCreateStore(reducers, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('reducers', () => {
      const nextReducer = require('reducers')
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
