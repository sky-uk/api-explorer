import React from 'react'
import { Route } from 'react-router'

import Application from 'containers/Application'

export default function () {
  return (
    <Route>
      <Route path='/' component={Application} />
    </Route>
  )
}
