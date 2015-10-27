import 'babel-core/polyfill'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import App from './App'
import OtherPage from './OtherPage'

import { Route } from 'react-router'
import { ReduxRouter } from 'redux-router'

export default class Root extends Component {
  render () {
    const { store } = this.props
    return (
      <Provider store={store}>
        <ReduxRouter>
          <Route path='/' component={App} />
          <Route path='/other' component={OtherPage} />
        </ReduxRouter>
      </Provider>
    )
  }
}
