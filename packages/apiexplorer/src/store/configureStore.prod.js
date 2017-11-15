import reducers from './../reducers'
import createHistory from 'history/createBrowserHistory' 
import thunk from 'redux-thunk'

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history)

const composed = window.devToolsExtension
  ? compose(
      applyMiddleware(thunk, middleware),
    )
  : compose(
      applyMiddleware(thunk, middleware)
    )

export default function configureStore (initialState) {
  const finalCreateStore = composed(createStore)
  const store = finalCreateStore(reducers, initialState)
  return store
}
