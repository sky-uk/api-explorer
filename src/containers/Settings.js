import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class Settings extends Component {

  render () {
    return (
      <div className='settings-panes'>
        <h2>Settings</h2>
        <p>In this page you can configure API Explorer settings. Please use the following tabs.</p>

        <ul className="nav nav-tabs">
          {APIExplorer.settingsPanes.map((pane, i) => {
            const url = `/settings/${pane.slug}`
            return (<li key={i} className={this.props.history.isActive(url) ? 'active' : ''}>
              <Link key={i} to={`/settings/${pane.slug}`} className='operation-container' >{pane.name}</Link>
            </li>)
          })}
        </ul>
        {this.props.children}

      </div>
    )
  }

}

Settings.propTypes = {
  children: PropTypes.element,
  history: PropTypes.object
}

export default Settings
