import React, { PropTypes, Component } from 'react'
import { AppLogo } from './../components'

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
          <pre style={{ textAlign: 'left', fontSize: 10, marginLeft: '20%', marginRight: '20%' }}>
            { progressMessages.reverse().map(p => <div key={p}>{(new Date()).toLocaleTimeString()} {p}</div>) }
          </pre>
        </div>
        <div style={{ position: 'fixed', bottom: 10, right: 10 }} >
          <a href='#' id='btnResetExplorer'>reset explorer</a>
        </div>
      </div>
    )
  }
}

// ApplicationLoading.propTypes = {
//   currentStep: PropTypes.string.isRequired,
//   progressMessages: PropTypes.array.isRequired
// }

export default ApplicationLoading
