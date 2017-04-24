import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'

class GeneralSettings extends Component {
  render () {
    return (
      <Segment attached='bottom'>
        <h4>General Settings</h4>
        <p>Please select one of the other tabs to configure API Explorer.</p>
      </Segment>
    )
  }
}

export default GeneralSettings
