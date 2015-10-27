import 'babel-core/polyfill'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import App from './App'
import OtherPage from './OtherPage'
import SettingsPage from './SettingsPage'
import DevTools from './DevTools'

import { Route } from 'react-router'
import { ReduxRouter } from 'redux-router'

export default class Root extends Component {
  render () {
    const { store } = this.props
    return (
      <Provider store={store}>
        <div>
          <ReduxRouter>
            <Route path='/' component={App} />
            <Route path='/other' component={OtherPage} />
            <Route path='/settings' component={SettingsPage} />
          </ReduxRouter>
          <DevTools />
        </div>
      </Provider>
    )
  }
}
