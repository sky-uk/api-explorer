import 'babel-core/polyfill'
import React from 'react'
import { render } from 'react-dom'
import configureStore from './store/configureStore'
import Root from './containers/Root'

const store = configureStore()

class APIExplorer {
  load () {
    return this
  }

  render (domAnchor = 'root') {
    render(<Root store={store} />, document.getElementById(domAnchor))
    return this
  }

}

const explorer = new APIExplorer()
module.exports = window.APIExplorer = explorer
