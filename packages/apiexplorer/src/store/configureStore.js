import { createStore, compose, applyMiddleware } from 'redux'
import { routerMiddleware } from 'connected-react-router'

import createRootReducer from './../reducers'
import { createBrowserHistory } from 'history'
import thunk from 'redux-thunk'

// Create a history of your choosing (we're using a browser history in this case)
export const history = createBrowserHistory()

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configureStore (initialState) {
  const store = createStore(
    createRootReducer(history),
    initialState,
    composeEnhancer(
      applyMiddleware(
        thunk,
        routerMiddleware(history)
      )
    )
  )

  return store
}
