import React, { Component } from 'react'
import { AppLogo } from './../components'
import { Segment } from 'semantic-ui-react'

class ApplicationLoading extends Component {
  render () {
    const { currentStep, progressMessages } = this.props

    const topLoadingStype = {
      backgroundColor: '#222',
      textAlign: 'center',
      color: 'white',
      paddingTop: '10%',
      height: 2000
    }

    return (
      <div>
        <div style={topLoadingStype} >
          <AppLogo width={128} />
          <br />
          <h1 id='loading-documentation'>Loading API documentation...</h1>
          <br />
          <br />
          <br />
          <p>
            { currentStep }
          </p>
          <Segment.Group style={{ textAlign: 'left', marginLeft: '20%', marginRight: '20%', color: '#333', fontFamily: '"Source Code Pro", monospace' }}>
            { progressMessages.reverse().map(p => <Segment key={p} style={{ fontSize: '0.8rem' }}>{(new Date()).toLocaleTimeString()} {p}</Segment>) }
          </Segment.Group>
        </div>
        <div style={{ position: 'fixed', bottom: 10, right: 10 }} >
          <a href='#' id='btnResetExplorer'>reset explorer</a>
        </div>
      </div>
    )
  }
}

export default ApplicationLoading
