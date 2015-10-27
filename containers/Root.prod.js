import 'babel-core/polyfill'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import App from './App'
import 'todomvc-app-css/index.css'

export default class Root extends Component {
  render () {
    const { store } = this.props
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}
