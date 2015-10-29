import React from 'react'
import { Route } from 'react-router'

import App from '../containers/App'
import OtherPage from '../containers/OtherPage'
import Settings from '../containers/SettingsPage'

export default function () {
  return (
    <Route>
      <Route path='/' component={App} />
      <Route path='/other' component={OtherPage} />
      <Route path='/settings' component={Settings} />
    </Route>
  )
}
