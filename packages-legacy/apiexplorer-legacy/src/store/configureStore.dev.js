import { createStore, compose, applyMiddleware } from 'redux'
import reducers from 'reducers'
import { reduxReactRouter } from 'redux-router'
import createHistory from 'history/lib/createBrowserHistory' // history/lib/createHashHistory
import thunk from 'redux-thunk'

const composed = window.devToolsExtension
  ? compose(
      applyMiddleware(thunk),
      reduxReactRouter({ createHistory }),
      window.devToolsExtension()
    )
  : compose(
      applyMiddleware(thunk),
      reduxReactRouter({ createHistory })
    )

export default function configureStore (initialState) {
  const finalCreateStore = composed(createStore)
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
