import 'babel-core/polyfill'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Route } from 'react-router'
import { ReduxRouter } from 'redux-router'

import Router from './Router'
import DevTools from '../containers/DevTools'

export default class RouterConfig extends Component {
  render () {
    return (
      <Router/>
    )
  }
}
