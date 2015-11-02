import React from 'react'
import { Route, IndexRoute } from 'react-router'

import Application from 'containers/Application'
import Welcome from 'containers/Welcome'
import OperationWidget from 'containers/OperationWidget'

export default function () {
  return (
    <Route path='/' component={Application}>
      <IndexRoute component={Welcome} />
      <Route path='operation/:id' component={OperationWidget} />
        {/*
          check: https://github.com/rackt/react-router/blob/master/examples/huge-apps/app.js#L61
        <Route path='spec' component={OperationWidgetSpec} />
        <Route path='try' component={OperationWidgetTry} />
        <Route path='resp' component={OperationWidgetResp} />
        */}
    </Route>
  )
}
