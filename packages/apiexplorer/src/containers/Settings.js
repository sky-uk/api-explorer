import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router-dom'
import { Switch, Route, Redirect } from 'react-router'
import { Menu } from 'semantic-ui-react'

class Settings extends Component {
  render () {
    return (
      <div className='settings-panes'>
        <h2>Settings</h2>
        <p>In this page you can configure API Explorer settings. Please use the following tabs.</p>

        <Menu attached='top' tabular>
          {APIExplorer.settingsPanes.map((pane, i) => {
            const url = APIExplorer.LinkGenerator.toSettings(pane.slug)
            return <Route key={pane.slug} path={`${this.props.match.path}${pane.slug}`} children={({ match }) => (
              <Menu.Item key={i} active={match !== null} name='' as={Link} to={url} >{pane.name}</Menu.Item>
            )} />
          })}
        </Menu>

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
