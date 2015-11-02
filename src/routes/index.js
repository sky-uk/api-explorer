import React from 'react'
import { Route, IndexRoute } from 'react-router'

import Application from 'containers/Application'
import Welcome from 'containers/Welcome'
import OperationWidget from 'components/OperationWidget'

import TryOutWidgetTab from 'components/widgets/TryOutWidgetTab'
import SpecWidgetTab from 'components/widgets/SpecWidgetTab'
import SchemaWidgetTab from 'components/widgets/SchemaWidgetTab'

export default function (store) {
  return (
    <Route path='/' component={Application}>
      <IndexRoute component={Welcome} />
      <Route path='operation/:id' component={OperationWidget} >
        {APIExplorer.widgetTabs.map( widgetTab =>
          <Route key={widgetTab.slug} path={widgetTab.slug} component={widgetTab.component} />
        )}
        </Route>
    </Route>
  )
}
