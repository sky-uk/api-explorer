import React, { Component, PropTypes } from 'react'

class GeneralSettings extends Component {
  render () {
    return (
      <div className='tab-content' >
        <h4>General Settings</h4>

        <h5><strong>TODO</strong></h5>
        <ul>
          <li>Swagger Spec URL</li>
          <li>If is using CORS proxy</li>
        </ul>

      </div>
    )
  }
}

GeneralSettings.propTypes = {
}

export default GeneralSettings
