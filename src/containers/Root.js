import 'babel-core/polyfill'
import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { ReduxRouter } from 'redux-router'

import getRoutes from 'routes'
import injectDevTools from 'components/DevTools'
import ReduxToastr from 'react-redux-toastr'

export default class Root extends Component {
  render () {
    const { store } = this.props
    const DevTools = injectDevTools()
    return (
        <Provider store={store}>
          <div>
            <ReduxRouter>
              {getRoutes(store)}
            </ReduxRouter>

            <ReduxToastr
              transitionIn='fadeIn'
              transitionOut='fadeOut'
              progressBar/>

            {!window.devToolsExtension && DevTools && <DevTools />}
          </div>
        </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
}
