import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router-dom'
import { Switch, Route, Redirect } from 'react-router'

class Settings extends Component {
  render () {
    return (
      <div className='settings-panes'>
        <h2>Settings</h2>
        <p>In this page you can configure API Explorer settings. Please use the following tabs.</p>

        <ul className='nav nav-tabs'>
          {APIExplorer.settingsPanes.map((pane, i) => {
            const settingsUrl = APIExplorer.LinkGenerator.toSettings(pane.slug)
            return <Route key={pane.slug} path={`${this.props.match.path}${pane.slug}`} children={({ match }) => (
              <li key={i} className={match ? 'active' : ''}>
                <Link key={i} to={settingsUrl} className='operation-container' >{pane.name}</Link>
              </li>)} />
            })}
        </ul>

        <Switch>
          {APIExplorer.settingsPanes.map(pane =>
            <Route key={pane.slug} path={`${this.props.match.path}${pane.slug}`} component={pane.component} />
          )}
          <Redirect to={`${this.props.match.path}${APIExplorer.settingsPanes[0].slug}`} />
        </Switch>
      </div>
    )
  }
}

Settings.propTypes = {
  children: PropTypes.element,
  history: PropTypes.object
}

export default Settings
