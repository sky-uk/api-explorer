import React, { Component } from 'react'
import { Label, Segment, Dropdown } from 'semantic-ui-react'

class GeneralSettings extends Component {
  render () {
    let headerOneValues = [
      { key: 'GB', value: 'GB', text: 'GB - UnitedKingdom' },
      { key: 'DE', value: 'DE', text: 'DE - Germany' },
      { key: 'IE', value: 'IE', text: 'IE - Ireland' },
      { key: 'AT', value: 'AT', text: 'AT - Austria' }
    ]
    let headerTwoValues = [
      { key: 'STORE', value: 'STORE', text: 'STORE - SkyStore' },
      { key: 'NOWTV', value: 'NOWTV', text: 'NOWTV - Now TV' }
    ]

    return (
      <Segment attached='bottom'>
        <h4>Request Headers</h4>
        <p>Headers used on all API Explorer requests</p>
        <Segment>
          <Label>Sky-OTT-Country</Label>
          <Dropdown placeholder='None' fluid search selection options={headerOneValues} />
        </Segment>

        <Segment>
          <Label>Sky-OTT-Proposition</Label>
          <Dropdown placeholder='NOWTV - Now TV' fluid search selection options={headerTwoValues} />
        </Segment>

      </Segment>
    )
  }
}

export default GeneralSettings
