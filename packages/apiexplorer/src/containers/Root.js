/* global APIExplorer */

import React, { Component } from 'react'
import { Provider } from 'react-redux'

import { ConnectedRouter } from 'connected-react-router'

import ReduxToastr from 'react-redux-toastr'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Application from '../containers/Application'
import NotFound from '../containers/NotFound'

import { Helmet } from 'react-helmet'

export default class Root extends Component {
  render () {
    const { store, history } = this.props

    return (
      <Provider store={store}>
        <div>
          <Helmet>
            <title>API Explorer</title>
            <link rel='shortcut icon' type='image/png' href='/images/favicon.png' />
            <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css' />
            <link rel='stylesheet' href='//fonts.googleapis.com/css?family=Source+Code+Pro' />
            <link rel='stylesheet' href='//diegoddox.github.io/react-redux-toastr/4.0/react-redux-toastr.min.css' />
          </Helmet>
          <ConnectedRouter history={history}>
            <BrowserRouter>
              <Switch>
                <Route path={`${APIExplorer.basePath}`} component={Application} />
                <Route component={NotFound} />
              </Switch>
            </BrowserRouter>
          </ConnectedRouter>
          <ReduxToastr transitionIn='fadeIn' transitionOut='fadeOut' progressBar />
        </div>
      </Provider>
    )
  }
}
