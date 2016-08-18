import React from 'react'
import { Route, IndexRoute, IndexRedirect } from 'react-router'

import Application from 'containers/Application'
import Settings from 'containers/Settings'
import Welcome from 'containers/Welcome'
import OperationWidgetContainer from 'containers/OperationWidgetContainer'
import NotFound from 'containers/NotFound'

export default function (store) {
  const basePath = `${APIExplorer.basePath}/`

  return (
    <Route>
      <Route path={basePath} component={Application}>
        <IndexRoute component={Welcome} />
        <Route path='operation/:id' component={OperationWidgetContainer} >
          {APIExplorer.widgetTabs.map(widgetTab =>
            <Route key={widgetTab.slug} path={widgetTab.slug} component={widgetTab.component} />
          )}
        </Route>
        <Route path='settings' component={Settings} >
          <IndexRedirect to={APIExplorer.settingsPanes[0].slug} />
          {APIExplorer.settingsPanes.map(pane =>
            <Route key={pane.slug} path={pane.slug} component={pane.component} />
          )}
        </Route>
      </Route>
      <Route path='*' component={NotFound} />
    </Route>
  )
}
