import 'babel-core/polyfill'
import React from 'react'
import { render } from 'react-dom'
import configureStore from './store/configureStore'
import Root from './containers/Root'
import { load as loadSpec } from './actions/loadActionCreators'

const store = configureStore()

class APIExplorer {
  load (url, specType) {
    store.dispatch(loadSpec(url, specType))
    return this
  }

  render (domAnchor = 'root') {
    render(<Root store={store} />, document.getElementById(domAnchor))
    return this
  }
}

const explorer = new APIExplorer()
module.exports = window.APIExplorer = explorer
