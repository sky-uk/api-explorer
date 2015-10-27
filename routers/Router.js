import 'babel-core/polyfill'
import React, { Component } from 'react'
import { Route } from 'react-router'
import { ReduxRouter } from 'redux-router'

import App from '../containers/App'
import OtherPage from '../containers/OtherPage'
import Settings from '../containers/SettingsPage'

export default class Router extends Component {
  render () {
    return (
          <ReduxRouter>
            <Route path='/' component={App} />
            <Route path='/other' component={OtherPage} />
            <Route path='/settings' component={Settings} />
          </ReduxRouter>
    )
  }
}

