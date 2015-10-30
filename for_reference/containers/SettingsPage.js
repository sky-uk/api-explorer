import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class SettingsPage extends Component {
  render () {
    const { settings } = this.props
    return (
      <div>
        <h1>Settings</h1>
        <br/>
        Width: <span>{settings.width}</span>
        <br/>
        <Link to='/'>Go Back!</Link>
      </div>
    )
  }
}

SettingsPage.propTypes = {
  settings: PropTypes.object.isRequired
}

export default connect(
  state => ({ settings: state.settings })
)(SettingsPage)
