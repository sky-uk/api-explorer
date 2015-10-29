import React from 'react'
import { Route } from 'react-router'

//import App from '../containers/App'
import Application from '../containers/Application'
import OtherPage from '../containers/OtherPage'
import Settings from '../containers/SettingsPage'

export default function () {
  return (
    <Route>
      <Route path='/' component={Application} />
      <Route path='/other' component={OtherPage} />
      <Route path='/settings' component={Settings} />
    </Route> 
  )
}
