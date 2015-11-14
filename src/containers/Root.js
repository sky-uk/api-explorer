import 'babel-core/polyfill'
import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { ReduxRouter } from 'redux-router'

import getRoutes from 'routes'
import injectDevTools from 'components/DevTools'

const PRODUCTION_BUILD = process.env.NODE_ENV === 'production'

export default class Root extends Component {
  render () {
    const { store } = this.props
    const DevTools = PRODUCTION_BUILD || injectDevTools()
    return (
      <Provider store={store}>
        <div>
          <ReduxRouter>
            {getRoutes(store)}
          </ReduxRouter>
          {PRODUCTION_BUILD && <DevTools />}
        </div>
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
}
